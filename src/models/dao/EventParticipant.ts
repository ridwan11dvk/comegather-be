import { Model } from 'objection';
import Event from './Event';
import Generic from './Generic';
import User from './User';

class EventParticipants extends Generic {
  eventId!: number;

  userId!: number;

  static get tableName() {
    return 'event_participants';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'event_participants.user_id',
          to: 'users.id',
        },
      },
      event: {
        relation: Model.BelongsToOneRelation,
        modelClass: Event,
        join: {
          from: 'event_participants.event_id',
          to: 'events.id',
        },
      },
    };
  }
}

export default EventParticipants;
