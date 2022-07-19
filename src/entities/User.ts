/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import User from '../models/dao/User';
import { IUserEntities } from './IUser';

@injectable()
export class UserEntities implements IUserEntities {
  async UpdateByID(ID: number, user: User, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await User.query(trx).update(user).where('id', ID);
    return success !== 0;
  }

  async UpdateLastLoginByID(ID: number, ll: Date, t?: TransactionOrKnex): Promise<boolean> {
    const success = await User.query(t).patch({ lastLogin: ll }).where('id', ID);
    return success !== 0;
  }

  async UpdatePasswordByID(ID: number, pw: string, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await User.query(trx).patch({ password: pw }).where('id', ID);
    return success !== 0;
  }

  async UpdateImageByID(ID: number, imageID: number, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await User.query(trx).patch({ imageId: imageID }).where('id', ID);
    return success !== 0;
  }

  async Create(user: User, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await User.query(trx).insert(user).returning('id');
    return id;
  }

  async GetByEmail(email: string, trx?: TransactionOrKnex): Promise<User> {
    const user = await User.query(trx).findOne('email', email);
    return user;
  }

  async GetByID(id: number, trx?: TransactionOrKnex): Promise<User> {
    const user = await User.query(trx).findById(id);
    return user;
  }

  async FetchRelations(user: User, graph: string): Promise<User> {
    const result = await user.$fetchGraph(graph);
    return result;
  }
}
