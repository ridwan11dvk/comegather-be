import { Router } from 'express';
import { TopicHandler } from '../../handler/Topic';

const router = Router();
const handler = new TopicHandler();
router.get('/', handler.GetTopics.bind(handler));
export default router;
