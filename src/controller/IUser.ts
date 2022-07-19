import {
  IEmail, IResetPw, IUser, ILogin, IRefreshToken,
} from '../models/dto/User';
import { Result, UserRequest } from '../types';

export interface IUserController{
  Register(iuser: IUser): Promise<Result>,
  RefreshToken(irefreshtoken: IRefreshToken): Promise<Result>,
  Login(ilogin: ILogin): Promise<Result>,
  // Ketika mencet forget password di frontend
  ForgetPassword(iemail: IEmail): Promise<Result>,
  // Ketika ngeklik link di email, lalu masuk frontend, dan frontend hit endpoint ini
  ResetPassword(UID: string, token: string, irestpw: IResetPw): Promise<Result>,

  GetProfile(req: UserRequest): Promise<Result>
}
