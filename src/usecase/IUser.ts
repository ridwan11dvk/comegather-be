import { TransactionOrKnex } from 'objection';
import User from '../models/dao/User';
import { IUser } from '../models/dto/User';

export interface IUserUC{
  Create(user: IUser, trx?: TransactionOrKnex): Promise<number>,
  GetByEmail(email: string, trx?: TransactionOrKnex): Promise<User>,
  GetByID(ID: number, trx?: TransactionOrKnex): Promise<User>,
  FetchRelations(user: User, graph: string[]): Promise<User|null>,
  // Mungkin bisa bertambah params updatenya, ga cuma password
  UpdateByID(
    ID: number,
    update: {
      password?: string,
      lastLogin?: Date,
      imageID?: number,
      user?: User,
    },
    trx?: TransactionOrKnex
  ): Promise<boolean>,
}
