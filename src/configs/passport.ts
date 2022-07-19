import { Strategy as JWTStrat, StrategyOptions } from 'passport-jwt';
import dotenv from 'dotenv';
import { Request } from 'express';
import passport from 'passport';
import container from '../infrastructure/inversify.config';
import { IUserUC } from '../usecase/IUser';
import TYPES from '../types';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env') })

const options: StrategyOptions = {
  secretOrKey: 'e444537ea9636a3f5a94135ec326e46866b93fc12746ba407f30de16efafb2f2d750592974cd3fe9c231a7df02192250a689',
  jwtFromRequest: (req: Request): string => {
    let token = (req.headers.authorization || '').split(' ')[1];
    if (!token) token = req.cookies.accessToken;
    return token;
  },
};

passport.use(
  new JWTStrat(options, async (payload, done) => {
    const { data: id, exp } = payload;
    const userUC = container.get<IUserUC>(TYPES.IUserUC);
    if (Date.now() >= exp * 1000) return done(null, false);
    try {
      const user = await userUC.GetByID(id);
      if (!user) throw new Error('User not found');
      return done(null, user);
    } catch (err) {
      return done(null, false);
    }
  }),
);
