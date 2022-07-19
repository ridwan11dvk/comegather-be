import { TransactionOrKnex } from 'objection';
import Topic from '../models/dao/Topic';
import { ITopic } from '../models/dto/Topic';

export interface ITopicUC{
  Create(topic: ITopic, trx?: TransactionOrKnex): Promise<number>,
  GetTopics(): Promise<Topic[]>,
}
