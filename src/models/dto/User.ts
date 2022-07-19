import { isValidEmail } from '../../utils/validator';
import User from '../dao/User';

export interface IEmail{
  email: string,
}

export const isIEmail = (input: any): input is IEmail => {
  try {
    return isValidEmail(input.email);
  } catch (e) {
    return false;
  }
};

export interface ILogin{
  email: string,
  password: string,
}

export const isILogin = (input: any): input is ILogin => {
  try {
    if (typeof input.password !== 'string') return false;
    return isValidEmail(input.email);
  } catch (e) {
    return false;
  }
};

export interface IResetPw{
  password1: string,
  password: string,
}

export const isIResetPw = (input: any): input is IResetPw => {
  try {
    if (typeof input.password1 !== 'string') return false;
    if (typeof input.password !== 'string') return false;
    return true;
  } catch (e) {
    return false;
  }
};

export interface IRefreshToken{
  refreshToken: string,
}

export const isIRefreshToken = (input: any): input is IRefreshToken => {
  try {
    if (typeof input.refreshToken !== 'string') return false;
    return true;
  } catch (err) {
    return false;
  }
};

export interface IUser{
  email: string,
  password: string,
  password1: string,
  fullname: string,
  username: string,
  locationId: number,
  interests: number[],
  imageId?: number,
  // TODO: add more attributes
}

export const isIUser = (input: any): input is IUser => {
  try {
    if (typeof input.password !== 'string') return false;
    if (typeof input.password1 !== 'string') return false;
    if (!isValidEmail(input.email)) return false;
    if (typeof input.fullname !== 'string') return false;
    if (typeof input.username !== 'string') return false;
    if (typeof input.locationId !== 'number') return false;
    if (!Array.isArray(input.interests)) return false;
    if (input.imageId && typeof input.imageId !== 'number') return false;
    const objs = Object.values(input.interests);
    return objs.every((e) => typeof e === 'number');
    // TODO: add more attributes
  } catch (err) {
    return false;
  }
};

export const toDAO = (user: IUser) => User.fromJson(user, { skipValidation: false });
