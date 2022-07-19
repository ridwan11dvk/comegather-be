import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { ICommunityTopic, toDAO } from '../models/dto/CommunityTopic';
import { ICommunityTopicEntities } from '../entities/ICommunityTopic';
import TYPES from '../types';
import { ICommunityTopicUC } from './ICommunityTopic';

@injectable()
export class CommunityTopicUC implements ICommunityTopicUC {
  private CommunityTopicEntities: ICommunityTopicEntities;

  constructor(@inject(TYPES.ICommunityTopicEntities)
    CommunityTopicEntities: ICommunityTopicEntities) {
    this.CommunityTopicEntities = CommunityTopicEntities;
  }

  async Create(communityTopic: ICommunityTopic, trx?: TransactionOrKnex): Promise<number> {
    return this.CommunityTopicEntities.Create(toDAO(communityTopic), trx);
  }
}
