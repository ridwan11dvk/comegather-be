import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { IEParticipant, toDao } from '../models/dto/EventParticipant';
import { IEParticipantEntities } from '../entities/IEParticipant';
import TYPES from '../types';
import { IEParticipantUC } from './IEParticipants';

@injectable()
export class EventParticipantUC implements IEParticipantUC {
  private EventParticipantEntities: IEParticipantEntities;

  constructor(@inject(TYPES.IEParticipantEntities) EParticipantEntities: IEParticipantEntities) {
    this.EventParticipantEntities = EParticipantEntities;
  }

  async Create(participant: IEParticipant, trx?: TransactionOrKnex): Promise<number> {
    return this.EventParticipantEntities.Create(toDao(participant), trx);
  }

  async Delete(participant: IEParticipant, trx?: TransactionOrKnex): Promise<boolean> {
    return this.EventParticipantEntities.Delete(toDao(participant), trx);
  }
}
