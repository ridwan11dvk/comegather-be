import { IAdminIds, ICommunity } from '../models/dto/Community';
import { IEvent } from '../models/dto/Event';
import { Result, UserRequest } from '../types';

export interface ICommunityController{
  Create(req: UserRequest, icommunity: ICommunity): Promise<Result>,

  GetCommunities(): Promise<Result>

  GetCommunityDetail(community_id: number): Promise<Result>,

  Update(req: UserRequest, community_id: number, icommunity: ICommunity): Promise<Result>,

  JoinCommunity(req: UserRequest, community_id: number): Promise<Result>,

  LeaveCommunity(req: UserRequest, community_id: number): Promise<Result>,

  SetAdmin(req: UserRequest, community_id: number, admin_ids: IAdminIds): Promise<Result>,

  UnsetAdmin(req: UserRequest, community_id: number): Promise<Result>,

  GetMembersId(req: UserRequest, community_id: number): Promise<Result>,

  GetMembersCount(community_id: number): Promise<Result>,

  GetMembershipStatus(req: UserRequest, community_id: number): Promise<Result>,

  CreateEvent(req: UserRequest, CID: number, ievent: IEvent): Promise<Result>,

  GetEvents(CID: number, upcoming: boolean): Promise<Result>,
}
