import { Model, ModelOptions, QueryContext } from 'objection';
import slugify from 'slugify';
import { base64Salt } from '../../configs/server';
import Community from './Community';
import EventParticipants from './EventParticipant';
import Generic from './Generic';
import User from './User';

class Event extends Generic {
  title!: string;

  description: string;

  publicId: string;

  slug: string;

  startedAt!: Date;

  endedAt: Date;

  communityId: number;

  isPublic!: boolean;

  type!: string;

  site!: string;

  capacity!: number;

  imageId: number;

  additionalInfo: string;

  participants: EventParticipants[];

  static get tableName() {
    return 'events';
  }

  static get relationMappings() {
    return {
      community: {
        relation: Model.BelongsToOneRelation,
        modelClass: Community,
        join: {
          from: 'events.community_id',
          to: 'communities.id',
        },
      },
      participants: {
        relation: Model.HasManyRelation,
        modelClass: EventParticipants,
        join: {
          from: 'events.id',
          to: 'event_participants.event_id',
        },
      },
      participants_user: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'events.id',
          through: {
            from: 'event_participants.event_id',
            to: 'event_participants.user_id',
          },
          to: 'users.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        title: {
          description: 'title of event',
          type: 'string',
        },
        description: {
          description: 'description of event',
          type: 'string',
        },
        startedAt: {
          description: 'event started at',
          type: 'string',
        },
        endedAt: {
          description: 'event ended at',
          type: 'string',
        },
        communityId: {
          description: 'id community that held the event',
          type: 'number',
        },
        isPublic: {
          description: 'is event public',
          type: 'boolean',
        },
        imageId: {
          description: 'id of image',
          type: 'number',
        },
        type: {
          description: 'type of event',
          type: 'string',
          enum: ['onsite', 'online'],
        },
        site: {
          description: 'site of event',
          type: 'string',
        },
        capacity: {
          description: 'total capacity of event',
          type: 'number',
        },
        additionalInfo: {
          description: 'additional info of event',
          type: 'string',
        },
      },
      required: ['title', 'startedAt', 'isPublic', 'type', 'site', 'capacity'],
    };
  }

  $beforeInsert(): void | Promise<any> {
    this.slug = slugify(this.title);
  }

  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void | Promise<any> {
    super.$beforeUpdate(opt, queryContext);
    if (!opt.patch || (opt.patch && this.title)) {
      this.slug = slugify(this.title);
    }
    this.updatedAt = new Date();
  }

  async $afterInsert(queryContext: QueryContext): Promise<any> {
    this.publicId = Buffer.from(`${base64Salt}${this.id}`).toString('base64');
    await Event.query(queryContext.transaction).patch({ publicId: this.publicId }).where('id', this.id);
  }
}

export default Event;
