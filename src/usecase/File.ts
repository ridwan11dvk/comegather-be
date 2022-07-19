import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { IFile, toDAO } from '../models/dto/File';
import { IFileEntities } from '../entities/IFile';
import TYPES from '../types';
import { IFileUC } from './IFile';
import File from '../models/dao/File';

@injectable()
export class FileUC implements IFileUC {
  private FileEntities: IFileEntities;

  constructor(@inject(TYPES.IFileEntities) FileEntities: IFileEntities) {
    this.FileEntities = FileEntities;
  }

  async PatchInUseByID(id: number, trx?: TransactionOrKnex): Promise<boolean> {
    return this.FileEntities.UpdateByID(id, trx);
  }

  async GetByID(ID: number, trx?: TransactionOrKnex): Promise<File> {
    return this.FileEntities.GetByID(ID, trx);
  }

  async Create(file: IFile, trx?: TransactionOrKnex): Promise<number> {
    return this.FileEntities.Create(toDAO(file), trx);
  }

  async Delete(ID: number, trx?: TransactionOrKnex): Promise<File> {
    return this.FileEntities.Delete(ID, trx);
  }
}
