/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import File from '../models/dao/File';
import { IFileEntities } from './IFile';

@injectable()
export class FileEntities implements IFileEntities {
  async Create(file: File, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await File.query(trx).insert(file).returning('id');
    return id;
  }

  async GetByID(id: number, trx?: TransactionOrKnex): Promise<File> {
    const file = await File.query(trx).findById(id);
    return file;
  }

  async Delete(ID: number, trx?: TransactionOrKnex): Promise<File> {
    const file = await File.query(trx).delete().where({ id: ID }).returning(['file_name']);
    return file[0];
  }

  async UpdateByID(id: number, trx?: TransactionOrKnex): Promise<boolean> {
    const numberRow = await File.query(trx).findById(id).patch({ inUsed: true });
    // console.log(File.query(trx).update(file).where('id', id).toKnexQuery()
    //   .toQuery());
    // const numberRow = await File.query(trx).update(file).where('id', id);
    return numberRow !== 0;
  }
}
