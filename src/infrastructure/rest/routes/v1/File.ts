import { Router } from 'express';
import { FileHandler } from '../../handler/File';
import { isAuth } from '../../middleware/User';

const router = Router();
const handler = new FileHandler();
router.delete('/:ID', isAuth, handler.Delete.bind(handler));
router.post('/', isAuth, handler.Upload.bind(handler));
router.post('/upload-pp', isAuth, handler.UploadPP.bind(handler));
export default router;
