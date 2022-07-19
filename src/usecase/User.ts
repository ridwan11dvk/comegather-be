import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { IUser, toDAO } from '../models/dto/User';
import { IUserEntities } from '../entities/IUser';
import TYPES from '../types';
import { IUserUC } from './IUser';
import User from '../models/dao/User';

@injectable()
export class UserUC implements IUserUC {
  private UserEntities: IUserEntities;

  constructor(@inject(TYPES.IUserEntities) UserEntities: IUserEntities) {
    this.UserEntities = UserEntities;
  }

  async UpdateByID(
    ID: number,
    u: {
      password?: string,
      lastLogin?: Date,
      imageID: number,
      user: User,
    },
    t?: TransactionOrKnex,
  ): Promise<boolean> {
    if (u.password) {
      return this.UserEntities.UpdatePasswordByID(ID, u.password, t);
    }
    if (u.lastLogin) {
      return this.UserEntities.UpdateLastLoginByID(ID, u.lastLogin, t);
    }
    if (u.imageID) {
      return this.UserEntities.UpdateImageByID(ID, u.imageID, t);
    }
    if (u.user) {
      return this.UserEntities.UpdateByID(ID, u.user, t);
    }
    return false;
  }

  async GetByEmail(email: string, trx?: TransactionOrKnex): Promise<User> {
    return this.UserEntities.GetByEmail(email, trx);
  }

  async GetByID(ID: number, trx?: TransactionOrKnex): Promise<User> {
    return this.UserEntities.GetByID(ID, trx);
  }

  async Create(user: IUser, trx?: TransactionOrKnex): Promise<number> {
    return this.UserEntities.Create(toDAO(user), trx);
  }

  async FetchRelations(user: User, graph: string[]): Promise<User> {
    return this.UserEntities.FetchRelations(user, `[${graph.toString()}]`);
  }
}
