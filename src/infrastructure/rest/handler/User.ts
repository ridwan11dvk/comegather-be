import { Request, Response } from 'express';
import log4js from 'log4js';
import jwt from 'jsonwebtoken';
import { UniqueViolationError, ForeignKeyViolationError } from 'objection';
import container from '../../inversify.config';
import { IUserController } from '../../../controller/IUser';
import { clientRedis } from '../../../external/redis';
import {
  isIEmail, isILogin, isIRefreshToken, isIResetPw, isIUser,
} from '../../../models/dto/User';
import TYPES, { UserRequest } from '../../../types';

const log = log4js.getLogger('UserHandler');

export class UserHandler {
  private controller: IUserController;

  constructor() {
    this.controller = container.get<IUserController>(TYPES.IUserController);
  }

  async Register(req: Request, res: Response) {
    const reqBody = req.body;
    if (!isIUser(reqBody)) {
      return res.status(422).json({
        message: 'Failed during input validation',
      });
    }
    try {
      const result = await this.controller.Register(reqBody);
      if (result.error) {
        return res.status(result.error.code).json({
          message: result.error.details,
        });
      }
      return res.status(201).json({
        data: result.result,
      });
    } catch (err) {
      log.error(err.message);
      if (err instanceof UniqueViolationError) {
        return res.status(403).json({
          message: 'Username or email already in use',
        });
      }
      if (err instanceof ForeignKeyViolationError) {
        return res.status(403).json({
          message: 'LocationId or interests is not valid',
        });
      }
      return res.status(500).json({
        message: 'Could not register',
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async SignOut(req: UserRequest, res: Response) {
    let token = (req.headers.authorization || '').split(' ')[1];
    if (!token) token = req.cookies.accessToken;
    const payload = jwt.decode(token) as {
      exp: number,
    };
    if (payload.exp * 1000 > Date.now()) {
      clientRedis.setEx(token, Math.floor(payload.exp - (Date.now() / 1000)), 'true');
    }
    await clientRedis.unlink(`Refresh${req.user.id}`);
    req.logout();
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  }

  async RefreshToken(req: Request, res: Response) {
    const reqBody = req.body;
    if (!isIRefreshToken(reqBody)) {
      return res.status(422).json({
        message: 'Failed during input validation',
      });
    }
    try {
      const { result, error } = await this.controller.RefreshToken(reqBody);
      if (error) {
        return res.status(error.code).json({
          message: error.details,
        });
      }
      const { accessToken, refreshToken } = result;
      if (process.env.NODE_ENV !== 'staging') {
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: Number(process.env.COOKIE_EXPIRE_TIME),
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
      } else {
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: Number(process.env.COOKIE_EXPIRE_TIME),
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
        });
      }
      return res.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not refresh token',
      });
    }
  }

  async Login(req: Request, res: Response) {
    const reqBody = req.body;
    if (!isILogin(reqBody)) {
      return res.status(422).json({
        message: 'Failed during input validation',
      });
    }
    try {
      const result = await this.controller.Login(reqBody);
      if (result.error) {
        return res.status(result.error.code).json({
          message: result.error.details,
        });
      }
      const { accessToken, refreshToken } = result.result;
      if (process.env.NODE_ENV !== 'staging') {
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: Number(process.env.COOKIE_EXPIRE_TIME),
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
      } else {
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: Number(process.env.COOKIE_EXPIRE_TIME),
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
        });
      }
      return res.status(200).json({
        data: result.result,
      });
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not login',
      });
    }
  }

  async ForgetPassword(req: Request, res: Response) {
    const reqBody = req.body;
    if (!isIEmail(reqBody)) {
      return res.status(422).json({
        message: 'Failed during input validation',
      });
    }
    try {
      const result = await this.controller.ForgetPassword(reqBody);
      if (result.error) {
        return res.status(result.error.code).json({
          message: result.error.details,
        });
      }
      return res.sendStatus(200);
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not forget password',
      });
    }
  }

  async ResetPassword(req: Request, res: Response) {
    const reqBody = req.body;
    const { UID, token } = req.params;
    if (!isIResetPw(reqBody) || !UID || !token) {
      return res.status(422).json({
        message: 'Failed during input validation',
      });
    }
    try {
      const { error } = await this.controller.ResetPassword(UID, token, reqBody);
      if (error) {
        return res.status(error.code).json({
          message: error.details,
        });
      }
      return res.sendStatus(200);
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not reset password',
      });
    }
  }

  async GetProfile(req: UserRequest, res: Response) {
    try {
      // fetch graphs
      const result = await this.controller.GetProfile(req);
      const { error } = result;
      // delete fetched attributes
      if (error) {
        return res.status(error.code).json({
          message: error.details,
        });
      }
      return res.status(200).json({
        data: result.result,
      });
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not get profile',
      });
    }
  }
}
