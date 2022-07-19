/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import User from '../models/dao/User';
import { MockTable } from '../types';
import { IUserEntities } from './IUser';

export const mockUserTable: MockTable<User> = {
  table: [],
};

@injectable()
export class UserEntities implements IUserEntities {
  FetchRelations(user: User, graph: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  UpdateByID(ID: number, user: User, trx?: TransactionOrKnex): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async UpdateLastLoginByID(ID: number, lastLogin: Date, t?: TransactionOrKnex): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async UpdatePasswordByID(ID: number, pw: string, trx?: TransactionOrKnex): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async UpdateImageByID(ID: number, imageID: number, trx?: TransactionOrKnex): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  GetByEmail(_email: string, _trx?: TransactionOrKnex): Promise<User> {
    throw new Error('Method not implemented.');
  }

  GetByID(_ID: number, _trx?: TransactionOrKnex): Promise<User> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line no-unused-vars
  async Create(user: User, _trx?: TransactionOrKnex): Promise<number> {
    // const { id } = await User.query(trx).insert(user).returning('id');
    mockUserTable.table.push(user);
    return mockUserTable.table.length;
  }
}
