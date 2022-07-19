import { TransactionOrKnex } from 'objection';
import { IUserTopic } from '../models/dto/UserTopic';

export interface IUserTopicUC{
  Create(topic: IUserTopic, trx?: TransactionOrKnex): Promise<number>,
}
