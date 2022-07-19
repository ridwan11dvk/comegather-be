import { TransactionOrKnex } from 'objection';
import UserTopic from '../models/dao/UserTopic';

export interface IUserTopicEntities{
  Create(user_topic: UserTopic, trx?: TransactionOrKnex): Promise<number>,
}
