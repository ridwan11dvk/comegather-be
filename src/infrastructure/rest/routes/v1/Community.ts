import { Router } from 'express';
import { CommunityHandler } from '../../handler/Community';
import { isAuth } from '../../middleware/User';

const router = Router();
const handler = new CommunityHandler();
router.get('/', handler.GetCommunities.bind(handler));
router.post('/', isAuth, handler.Create.bind(handler));
router.get('/:CID', handler.GetCommunityDetail.bind(handler));
router.put('/:CID', isAuth, handler.Update.bind(handler));
router.get('/:CID/members', isAuth, handler.GetMembersId.bind(handler));
router.get('/:CID/members/count', handler.GetMembersCount.bind(handler));
router.post('/:CID/events', isAuth, handler.CreateEvent.bind(handler));
router.get('/:CID/events', handler.GetEvents.bind(handler));
router.get('/:CID/members/status', isAuth, handler.GetMembershipStatus.bind(handler));
// router.post('/:CID/members/:UID', isAuth, handler.JoinCommunity.bind(handler));
// router.delete('/:CID/members/:UID', isAuth, handler.LeaveCommunity.bind(handler));
export default router;
