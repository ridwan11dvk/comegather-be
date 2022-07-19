import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import '../../../configs/passport';
import User from '../../../models/dao/User';
import { clientRedis } from '../../../external/redis';

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token = (req.headers.authorization || '').split(' ')[1];
  if (!token) token = req.cookies.accessToken;
  try {
    // Check if token blacklisted on redis
    const data = await clientRedis.get(token || '');
    if (data) {
      return res.status(401).json({
        message: 'User not authorized',
      });
    }
    return passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
      if (err || !user) {
        return res.status(401).json({
          message: 'User not authorized',
        });
      }
      req.user = user;
      return next();
    })(req, res, next);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
