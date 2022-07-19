import { TransactionOrKnex } from 'objection';
import { ICommunityTopic } from '../models/dto/CommunityTopic';

export interface ICommunityTopicUC{
  Create(topic: ICommunityTopic, trx?: TransactionOrKnex): Promise<number>,
}
