/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import UserTopic from '../models/dao/UserTopic';
import { IUserTopicEntities } from './IUserTopic';

@injectable()
export class UserTopicEntities implements IUserTopicEntities {
  async Create(user_topic: UserTopic, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await UserTopic.query(trx).insert(user_topic).returning('id');
    return id;
  }
}
