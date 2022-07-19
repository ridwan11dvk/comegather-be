import { TransactionOrKnex } from 'objection';
import Event from '../models/dao/Event';

export interface IEventEntities{
  Create(event: Event, trx?: TransactionOrKnex): Promise<number>,
  UpdateByID(ID: number, event: Event, trx?: TransactionOrKnex): Promise<boolean>,
  GetByID(ID: number, trx?: TransactionOrKnex): Promise<Event>,
  GetAll(trx?: TransactionOrKnex): Promise<Event[]>,
  FetchRelations(event: Event, graph: string): Promise<Event>,
  DeleteByID(ID: number, trx?: TransactionOrKnex): Promise<boolean>,
}
