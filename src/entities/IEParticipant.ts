import { TransactionOrKnex } from 'objection';
import EventParticipants from '../models/dao/EventParticipant';

export interface IEParticipantEntities{
  Create(participant: EventParticipants, trx?: TransactionOrKnex): Promise<number>,
  Delete(participant: EventParticipants, trx?: TransactionOrKnex): Promise<boolean>
}
