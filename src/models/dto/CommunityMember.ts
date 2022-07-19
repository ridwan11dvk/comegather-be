import CommunityMember from '../dao/CommunityMember';

export interface ICommunityMember{
  communityId: number,
  userId: number,
}

export const toDAO = (topic: ICommunityMember) => CommunityMember
  .fromJson(topic, { skipValidation: false });
