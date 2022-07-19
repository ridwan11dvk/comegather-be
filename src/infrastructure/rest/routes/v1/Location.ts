import { Router } from 'express';
import { LocationHandler } from '../../handler/Location';

const router = Router();
const handler = new LocationHandler();
router.get('/', handler.GetLocations.bind(handler));
export default router;
