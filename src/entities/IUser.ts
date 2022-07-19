import { TransactionOrKnex } from 'objection';
import User from '../models/dao/User';

export interface IUserEntities{
  Create(user: User, trx?: TransactionOrKnex): Promise<number>,
  GetByEmail(email: string, trx?: TransactionOrKnex): Promise<User>,
  GetByID(ID: number, trx?: TransactionOrKnex): Promise<User>,
  FetchRelations(user: User, graph: string): Promise<User>,
  UpdatePasswordByID(ID: number, password: string, trx?: TransactionOrKnex): Promise<boolean>,
  UpdateLastLoginByID(ID: number, lastLogin: Date, trx?: TransactionOrKnex): Promise<boolean>,
  UpdateImageByID(ID: number, imageID: number, trx?: TransactionOrKnex): Promise<boolean>,
  UpdateByID(ID: number, user: User, trx?: TransactionOrKnex): Promise<boolean>
}
