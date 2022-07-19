import { Router } from 'express';
import { UserHandler } from '../../handler/User';
import { isAuth } from '../../middleware/User';

const router = Router();
const handler = new UserHandler();
router.post('/signup', handler.Register.bind(handler));
router.post('/signout', isAuth, handler.SignOut.bind(handler));
router.post('/login', handler.Login.bind(handler));
router.post('/refresh', handler.RefreshToken.bind(handler));
router.post('/forget-password', handler.ForgetPassword.bind(handler));
router.post('/reset-password/:UID/:token', handler.ResetPassword.bind(handler));
router.get('/profile', isAuth, handler.GetProfile.bind(handler));
export default router;
