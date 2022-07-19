import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { ITopic, toDAO } from '../models/dto/Topic';
import { ITopicEntities } from '../entities/ITopic';
import TYPES from '../types';
import { ITopicUC } from './ITopic';
import Topic from '../models/dao/Topic';

@injectable()
export class TopicUC implements ITopicUC {
  private TopicEntities: ITopicEntities;

  constructor(@inject(TYPES.ITopicEntities) TopicEntities: ITopicEntities) {
    this.TopicEntities = TopicEntities;
  }

  async Create(topic: ITopic, trx?: TransactionOrKnex): Promise<number> {
    return this.TopicEntities.Create(toDAO(topic), trx);
  }

  async GetTopics(): Promise<Topic[]> {
    return this.TopicEntities.GetTopics();
  }
}
