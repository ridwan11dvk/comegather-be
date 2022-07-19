/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import UserTopic from '../models/dao/UserTopic';
import { MockTable } from '../types';
import { IUserTopicEntities } from './IUserTopic';

export const mockUserTopicTable: MockTable<UserTopic> = {
  table: [],
};

@injectable()
export class UserTopicEntities implements IUserTopicEntities {
  // eslint-disable-next-line no-unused-vars
  async Create(user_topic: UserTopic, trx?: TransactionOrKnex): Promise<number> {
    mockUserTopicTable.table.push(user_topic);
    return mockUserTopicTable.table.length;
  }
}
