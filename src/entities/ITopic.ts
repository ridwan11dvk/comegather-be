import { TransactionOrKnex } from 'objection';
import Topic from '../models/dao/Topic';

export interface ITopicEntities{
  Create(topic: Topic, trx?: TransactionOrKnex): Promise<number>,
  GetTopics(): Promise<Topic[]>,
}
