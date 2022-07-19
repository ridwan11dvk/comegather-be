import UserTopic from '../dao/UserTopic';

export interface IUserTopic{
  userId: number,
  topicId: number,
}

export const toDAO = (topic: IUserTopic) => UserTopic.fromJson(topic, { skipValidation: false });
