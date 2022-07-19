import { TransactionOrKnex } from 'objection';
import Event from '../models/dao/Event';
import { IEvent } from '../models/dto/Event';

export interface IEventUC{
  Create(event: IEvent, trx?: TransactionOrKnex): Promise<number>,
  UpdateByID(ID: number, event: IEvent, trx?: TransactionOrKnex): Promise<boolean>
  GetByID(ID: number, trx?: TransactionOrKnex): Promise<Event>,
  GetAll(trx?: TransactionOrKnex): Promise<Event[]>,
  FetchRelations(event: Event, graph: string[]): Promise<Event|null>,
  DeleteByID(ID: number, trx?: TransactionOrKnex): Promise<boolean>,
}
