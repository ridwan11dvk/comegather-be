import { TransactionOrKnex } from 'objection';
import CommunityTopic from '../models/dao/CommunityTopic';

export interface ICommunityTopicEntities{
  Create(community_topic: CommunityTopic, trx?: TransactionOrKnex): Promise<number>,
}
