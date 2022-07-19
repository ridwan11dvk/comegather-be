import { Request, Response, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import userRouter from './User';
import fileRouter from './File';
import topicRouter from './Topic';
import locationRouter from './Location';
import communityRouter from './Community';
import eventRouter from './Event';
import '../../../../configs/passport';

const router = Router();
router.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => res.send(
  swaggerUi.generateHTML(await import('../../../../../docs/swagger.json')),
));
router.use('/users', userRouter);
router.use('/files', fileRouter);
router.use('/topics', topicRouter);
router.use('/locations', locationRouter);
router.use('/communities', communityRouter);
router.use('/events', eventRouter);
export default router;
