/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import Topic from '../models/dao/Topic';
import { ITopicEntities } from './ITopic';

@injectable()
export class TopicEntities implements ITopicEntities {
  async Create(topic: Topic, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await Topic.query(trx).insert(topic).returning('id');
    return id;
  }

  async GetTopics(): Promise<Topic[]> {
    return Topic.query().orderBy('id', 'asc');
  }
}
