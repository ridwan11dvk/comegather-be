/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import EventParticipants from '../models/dao/EventParticipant';
import { IEParticipantEntities } from './IEParticipant';

@injectable()
export class EventParticipantEntities implements IEParticipantEntities {
  async Create(participant: EventParticipants, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await EventParticipants.query(trx).insert(participant).returning('id');
    return id;
  }

  async Delete(participant: EventParticipants, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await EventParticipants.query(trx).delete()
      .where({ userId: participant.userId, eventId: participant.eventId });
    return success !== 0;
  }
}
