import { inject, injectable } from 'inversify';
import { Model } from 'objection';
import {
  Body, Example, Get, Path, Post, Request, Response, Route, SuccessResponse, Tags,
} from 'tsoa';
import { tokenResp, errorMsg, defaultResp } from '../models/dto';
import {
  IEmail, ILogin, IRefreshToken, IResetPw, IUser,
} from '../models/dto/User';
import TYPES, { Result, UserRequest } from '../types';
import { IUserUC } from '../usecase/IUser';
import { IUserController } from './IUser';
import { IUserTopicUC } from '../usecase/IUserTopic';
import {
  base64DecodeURL, base64EncodeURL, createJWT, createToken, refreshJWT, verifyToken,
} from '../utils/tokenizer';
import { sendResetEmail } from '../utils/nodemailer';
import { isValidPassword } from '../utils/validator';

@Tags('User')
@Route('users')
@injectable()
export class UserController implements IUserController {
  private UserUC: IUserUC;

  private UserTopicUC: IUserTopicUC;

  constructor(
    @inject(TYPES.IUserUC) UserUC: IUserUC,
    @inject(TYPES.IUserTopicUC) UserTopicUC: IUserTopicUC,
  ) {
    this.UserUC = UserUC;
    this.UserTopicUC = UserTopicUC;
  }

  /**
   * Registrasi user
   */
  @Post('/signup')
  @Response<errorMsg>(400, 'Invalid input', {
    message: 'Passwords don\'t match',
  })
  @Response<errorMsg>(400, 'Invalid input', {
    message: 'Passwords must have at least 8 char, contains 1 lowercase, 1 uppercase, 1 number, 1 symbol',
  })
  @Response<errorMsg>(403, 'Forbidden', {
    message: 'Email or username already used',
  })
  @Response<errorMsg>(422, 'Invalid input', {
    message: 'Failed during input validation',
  })
  @SuccessResponse(201, 'Register success')
  @Example({
    data: 'capeppl@gmail.com',
  })
  async Register(@Body() iuser: IUser): Promise<Result> {
    console.log('iuser', iuser)
    if (iuser.password1 !== iuser.password) {
      return {
        error: {
          code: 400,
          details: 'Passwords dont match',
        },
      };
    }
    if (!isValidPassword(iuser.password)) {
      return {
        error: {
          code: 400,
          details: 'Passwords must have at least 8 char, contains 1 lowercase, 1 uppercase, 1 number, 1 symbol',
        },
      };
    }
    const trx = await Model.startTransaction();
    try {
      const userId = await this.UserUC.Create(iuser, trx);
      const successUserTopics: Promise<number>[] = [];
      iuser.interests.forEach(
        (id) => successUserTopics.push(this.UserTopicUC.Create({ userId, topicId: id }, trx)),
      );
      await Promise.all(successUserTopics);
      await trx.commit();
      return {
        result: iuser.email,
      };
    } catch (error) {
      console.log('error signup', error)
      await trx.rollback();
      throw error;
    }
  }

  @Post('/refresh')
  @Example<tokenResp>({
    accessToken: 'secrettoken',
    refreshToken: 'secrettoken',
  })
  @SuccessResponse(200, 'Refresh token success')
  @Response<errorMsg>(422, 'Input non valid', {
    message: 'Failed during input validation',
  })
  @Response<errorMsg>(403, 'Invalid token', {
    message: 'Invalid refresh token',
  })
  @Response<errorMsg>(500, 'Server error', {
    message: 'Could not refresh',
  })
async RefreshToken(@Body() irefreshtoken: IRefreshToken): Promise<Result> {
  const id = await refreshJWT(irefreshtoken.refreshToken);
  if (!id) {
    return {
      error: {
        code: 403,
        details: 'Invalid refresh token',
      },
    };
  }
  const user = await this.UserUC.GetByID(id);
  const { accessToken, refreshToken } = await createJWT(user);
  return {
    result: {
      accessToken,
      refreshToken,
    },
  };
}

  /**
   * Login
   */
  @Post('/login')
  @Response<errorMsg>(403, 'Invalid Input', {
    message: 'Invalid email or password',
  })
  @Example<tokenResp>({
    accessToken: 'secrettoken',
    refreshToken: 'secrettoken',
  })
  async Login(@Body() ilogin: ILogin): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const user = await this.UserUC.GetByEmail(ilogin.email, trx);
      if (!user) {
        return {
          error: {
            code: 403,
            details: 'Invalid email or password',
          },
        };
      }
      const isValid = await user.verifyPassword(ilogin.password);
      if (!isValid) {
        return {
          error: {
            code: 403,
            details: 'Invalid email or password',
          },
        };
      }
      user.lastLogin = new Date();
      await this.UserUC.UpdateByID(user.id, { user }, trx);
      const { accessToken, refreshToken } = await createJWT(user);
      await trx.commit();
      return {
        result: {
          accessToken,
          refreshToken,
        },
      };
    } catch (e) {
      await trx.rollback();
      throw (e);
    }
  }

  /**
   * Send password reset to user's email
   */
  @Post('/forget-password')
  @Response<errorMsg>(404, 'Not Found', {
    message: 'User not found',
  })
  async ForgetPassword(@Body() iemail: IEmail): Promise<Result> {
    const user = await this.UserUC.GetByEmail(iemail.email);
    if (!user) {
      return {
        error: {
          code: 404,
          details: 'User not found',
        },
      };
    }
    const token = createToken(user);
    await sendResetEmail(iemail.email, base64EncodeURL(`${user.id}`), token);
    return {};
  }

  // eslint-disable-next-line class-methods-use-this
  /**
   * Reset user's password
   * @param UID the user's ID
   * @param token the user's token
   */
  @Post('/reset-password/:UID/:token')
  @Response<errorMsg>(400, 'Not Found', {
    message: 'UID doesn\'t valid',
  })
  @Response<errorMsg>(400, 'Not Found', {
    message: 'Passwords don\'t match',
  })
  @Response<errorMsg>(403, 'Forbidden', {
    message: 'Invalid token',
  })
  async ResetPassword(
    @Path() UID: string,
    @Path() token: string,
    @Body() ipw: IResetPw,
  ): Promise<Result> {
    const ID = parseInt(base64DecodeURL(UID), 10);
    if (Number.isNaN(ID)) {
      return {
        error: {
          code: 400,
          details: 'UID doesnt valid',
        },
      };
    }
    if (ipw.password1 !== ipw.password) {
      return {
        error: {
          code: 400,
          details: 'Passwords dont match',
        },
      };
    }
    if (!isValidPassword(ipw.password1)) {
      return {
        error: {
          code: 400,
          details: 'Passwords must have at least 8 char, contains 1 lowercase, 1 uppercase, 1 number, 1 symbol',
        },
      };
    }
    const trx = await Model.startTransaction();
    try {
      const user = await this.UserUC.GetByID(ID, trx);
      if (!user) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'User not found',
          },
        };
      }
      const { isVerified, isExpired } = verifyToken(user, token);
      if (!isVerified) {
        await trx.rollback();
        return {
          error: {
            code: 403,
            details: 'Invalid token',
          },
        };
      }
      if (isExpired) {
        await trx.rollback();
        return {
          error: {
            code: 403,
            details: 'Token is expired',
          },
        };
      }
      await this.UserUC.UpdateByID(user.id, { password: ipw.password1 }, trx);
      await trx.commit();
      return {};
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Get user's profile detail
   */
  @Get('/profile')
  @Response<errorMsg>(500, 'Server error', {
    message: 'Could not get profile, ask administrator',
  })
  @Response<errorMsg>(401, 'Unauthorized', {
    message: 'User not authorized',
  })
  @Example({
    id: 7,
    fullname: 'Ini Nama Panjang',
    username: 'username',
    email: 'semangatintegrasi@gmail.com',
    lastLogin: '2022-04-01T18:46:19.576Z',
    hasImage: null,
    locatedOn: {
      city: 'Bandung',
      stateProvince: 'Washington AC',
      country: 'Inazuma',
      postalCode: '81451',
      createdAt: '2022-04-01T18:37:13.474Z',
      updatedAt: '2022-04-01T18:37:13.474Z',
      imageId: null,
    },
    interestedIn: {
      name: 'Genshin Tidak Impact',
      description: 'Yes',
      createdAt: '2022-04-01T18:37:13.474Z',
      updatedAt: '2022-04-01T18:37:13.474Z',
      imageId: null,
    },
    joinedIn: '2022-04-01T18:37:13.474Z',
  })
  async GetProfile(@Request() req: UserRequest): Promise<Result> {
    const { user } = req;
    const result = await this.UserUC.FetchRelations(user, ['hasImage', 'interestedIn', 'locatedOn']);
    if (!result) {
      return {
        error: {
          code: 500,
          details: 'Could not get profile, ask administrator',
        },
      };
    }
    return {
      result,
    };
  }
}
