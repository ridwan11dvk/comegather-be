import { TransactionOrKnex } from 'objection';
import { IEParticipant } from '../models/dto/EventParticipant';

export interface IEParticipantUC{
  Create(participant: IEParticipant, trx?: TransactionOrKnex): Promise<number>,
  Delete(participant: IEParticipant, trx?: TransactionOrKnex): Promise<boolean>
}
