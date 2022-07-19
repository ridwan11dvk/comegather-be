import { Router } from 'express';
import { EventHandler } from '../../handler/Event';
import { isAuth } from '../../middleware/User';

const router = Router();
const handler = new EventHandler();
router.get('/', handler.GetAll.bind(handler));
router.post('/:EID/join', isAuth, handler.Join.bind(handler));

export default router;
