import CommunityTopic from '../dao/CommunityTopic';

export interface ICommunityTopic{
  communityId: number,
  topicId: number,
}

export const toDAO = (topic: ICommunityTopic) => CommunityTopic
  .fromJson(topic, { skipValidation: false });
