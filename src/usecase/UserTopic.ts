import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { IUserTopic, toDAO } from '../models/dto/UserTopic';
import { IUserTopicEntities } from '../entities/IUserTopic';
import TYPES from '../types';
import { IUserTopicUC } from './IUserTopic';

@injectable()
export class UserTopicUC implements IUserTopicUC {
  private UserTopicEntities: IUserTopicEntities;

  constructor(@inject(TYPES.IUserTopicEntities) UserTopicEntities: IUserTopicEntities) {
    this.UserTopicEntities = UserTopicEntities;
  }

  async Create(userTopic: IUserTopic, trx?: TransactionOrKnex): Promise<number> {
    return this.UserTopicEntities.Create(toDAO(userTopic), trx);
  }
}
