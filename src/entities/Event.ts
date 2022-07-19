/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import Event from '../models/dao/Event';
import { IEventEntities } from './IEvent';

@injectable()
export class EventEntities implements IEventEntities {
  async GetAll(trx?: TransactionOrKnex): Promise<Event[]> {
    const result = await Event.query(trx)
      .where('started_at', '>=', new Date())
      .andWhere('started_at', '<', new Date(new Date().setDate(new Date().getDate() + 7)))
      .orderBy('id', 'asc');
    return result;
  }

  async Create(event: Event, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await Event.query(trx).insert(event).returning('id');
    return id;
  }

  async UpdateByID(ID: number, event: Event, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await Event.query(trx).update(event).where('id', ID);
    return success !== 0;
  }

  async GetByID(ID: number, trx?: TransactionOrKnex): Promise<Event> {
    const event = await Event.query(trx).findById(ID);
    return event;
  }

  async FetchRelations(event: Event, graph: string): Promise<Event> {
    const result = await event.$fetchGraph(graph);
    return result;
  }

  async DeleteByID(ID: number, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await Event.query(trx).deleteById(ID);
    return success !== 0;
  }
}
