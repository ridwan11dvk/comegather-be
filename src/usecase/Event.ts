import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import Event from '../models/dao/Event';
import { toDao, IEvent } from '../models/dto/Event';
import { IEventEntities } from '../entities/IEvent';
import TYPES from '../types';
import { IEventUC } from './IEvent';

@injectable()
export class EventUC implements IEventUC {
  private EventEntities: IEventEntities;

  constructor(@inject(TYPES.IEventEntities) EventEntities: IEventEntities) {
    this.EventEntities = EventEntities;
  }

  async GetAll(trx?: TransactionOrKnex): Promise<Event[]> {
    return this.EventEntities.GetAll(trx);
  }

  async Create(event: IEvent, trx?: TransactionOrKnex): Promise<number> {
    return this.EventEntities.Create(toDao(event), trx);
  }

  async UpdateByID(ID: number, event: IEvent, trx?: TransactionOrKnex): Promise<boolean> {
    return this.EventEntities.UpdateByID(ID, toDao(event), trx);
  }

  async GetByID(ID: number, trx?: TransactionOrKnex): Promise<Event> {
    return this.EventEntities.GetByID(ID, trx);
  }

  async FetchRelations(event: Event, graph: string[]): Promise<Event> {
    return this.EventEntities.FetchRelations(event, `[${graph.toString()}]`);
  }

  async DeleteByID(ID: number, trx?: TransactionOrKnex): Promise<boolean> {
    return this.DeleteByID(ID, trx);
  }
}
