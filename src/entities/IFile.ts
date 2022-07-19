import { TransactionOrKnex } from 'objection';
import File from '../models/dao/File';

export interface IFileEntities{
  Create(file: File, trx?: TransactionOrKnex): Promise<number>,
  GetByID(ID: number, trx?: TransactionOrKnex): Promise<File>,
  Delete(ID: number, trx?: TransactionOrKnex): Promise<File>,
  UpdateByID(id: number, trx?: TransactionOrKnex): Promise<boolean>
}
