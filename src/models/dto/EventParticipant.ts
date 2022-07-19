import EventParticipants from '../dao/EventParticipant';

export interface IEParticipant{
  eventId: number,
  userId: number,
}

export const toDao = (eParticipant: IEParticipant) => EventParticipants.fromJson(
  eParticipant,
  { skipValidation: true },
);
