import { TransactionOrKnex } from 'objection';
import File from '../models/dao/File';
import { IFile } from '../models/dto/File';

export interface IFileUC{
  Create(file: IFile, trx?: TransactionOrKnex): Promise<number>,
  GetByID(ID: number, trx?: TransactionOrKnex): Promise<File>,
  Delete(ID: number, trx?: TransactionOrKnex): Promise<File>,
  PatchInUseByID(id: number, trx?: TransactionOrKnex): Promise<boolean>,
}
