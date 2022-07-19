import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../../models/dao/User';
import { clientRedis } from '../../external/redis';

dotenv.config({ path: `${__dirname}/../../.env` });

export const base64EncodeURL = (input: string) => Buffer.from(input).toString('base64url');

export const base64DecodeURL = (input: string) => Buffer.from(input, 'base64url').toString('ascii');

const getHmac = (
  user: User,
  now: Date = new Date(),
) => {
  const payload = CryptoJS.enc.Utf8.parse(`${user.id}${user.password}${user.lastLogin || ''}${now}`);
  const key = CryptoJS.enc.Utf8.parse(process.env.SECRET_ACCESS_KEY);
  const hmac = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(payload, key));
  return hmac;
};

export const createToken = (
  user: User,
) => {
  const now = new Date();
  const hmac = getHmac(user, now);
  return `${base64EncodeURL(hmac)}.${base64EncodeURL(`${now}`)}`;
};

export const verifyToken = (
  user: User,
  token: string,
) => {
  const [hmac_base64, timestamp_base64] = token.split('.');
  const time = base64DecodeURL(timestamp_base64);
  const isExpired = (new Date(time).getTime()
    + 1000 * parseInt(process.env.TOKEN_EXPIRE_TIME, 10) < Date.now());
  const computedHMAC = getHmac(user, new Date(time));
  const HMAC = base64DecodeURL(hmac_base64);
  return { isVerified: computedHMAC === HMAC, isExpired };
};

export const createJWT = async (user: User) => {
  const accessToken = jwt.sign({ data: user.id }, process.env.SECRET_ACCESS_KEY, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
  });
  const refreshTime = Number.parseInt(process.env.JWT_REFRESH_EXPIRE_TIME, 10);
  const refreshID = randomUUID({ disableEntropyCache: true });
  const oldRefreshID = await clientRedis.get(`Refresh${user.id}`);
  if (oldRefreshID) {
    await clientRedis.unlink(`Refresh${user.id}`);
  }
  clientRedis.setEx(`Refresh${user.id}`, refreshTime, refreshID);
  const refreshToken = jwt.sign({ data: user.id, refreshID }, process.env.SECRET_REFRESH_KEY, {
    expiresIn: refreshTime,
  });
  return { accessToken, refreshToken };
};

export const refreshJWT = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY) as {
    data: number,
    refreshID: string,
    exp: number,
  };
  if (decoded.exp * 1000 < Date.now() || !decoded.data) {
    return 0;
  }
  const RidRedis = await clientRedis.get(`Refresh${decoded.data}`);
  if (RidRedis !== decoded.refreshID) {
    await clientRedis.unlink(`Refresh${decoded.data}`);
    return 0;
  }
  return decoded.data;
};
