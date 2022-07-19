/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import CommunityTopic from '../models/dao/CommunityTopic';
import { ICommunityTopicEntities } from './ICommunityTopic';

@injectable()
export class CommunityTopicEntities implements ICommunityTopicEntities {
  async Create(community_topic: CommunityTopic, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await CommunityTopic.query(trx).insert(community_topic).returning('id');
    return id;
  }
}
