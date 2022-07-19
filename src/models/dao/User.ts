import bcrypt from 'bcryptjs';
import {
  Model, ModelOptions, Pojo, QueryContext,
} from 'objection';
import Event from './Event';
import EventParticipants from './EventParticipant';
import File from './File';
import Generic from './Generic';
import Location from './Location';
import Topic from './Topic';
import Community from './Community';
import CommunityMember from './CommunityMember';

class User extends Generic {
  email!: string;

  fullname!: string;

  username!: string;

  password!: string;

  locationId!: number;

  lastLogin: Date;

  imageId: number;

  static get tableName() {
    return 'users';
  }

  static relationMappings = {
    locatedOn: {
      relation: Model.BelongsToOneRelation,
      modelClass: Location,
      join: {
        from: 'users.location_id',
        to: 'locations.id',
      },
    },
    interestedIn: {
      relation: Model.ManyToManyRelation,
      modelClass: Topic,
      join: {
        from: 'users.id',
        through: {
          from: 'user_topics.user_id',
          to: 'user_topics.topic_id',
        },
        to: 'topics.id',
      },
    },
    hasImage: {
      relation: Model.HasOneRelation,
      modelClass: File,
      join: {
        from: 'users.image_id',
        to: 'files.id',
      },
    },
    participates: {
      relation: Model.HasManyRelation,
      modelClass: EventParticipants,
      join: {
        from: 'users.id',
        to: 'event_participants.user_id',
      },
    },
    events: {
      relation: Model.ManyToManyRelation,
      modelClass: Event,
      join: {
        from: 'users.id',
        through: {
          from: 'event_participants.user_id',
          to: 'event_participants.event_id',
        },
        to: 'events.id',
      },
    },
    memberOf: {
      relation: Model.ManyToManyRelation,
      modelClass: Community,
      join: {
        from: 'users.id',
        through: {
          from: 'community_members.user_id',
          to: 'community_members.community_id',
          extra: {
            isAdmin: 'community_members.is_admin',
          },
        },
        to: 'communities.id',
      },
    },
    memberOfId: {
      relation: Model.HasManyRelation,
      modelClass: CommunityMember,
      join: {
        from: 'users.id',
        to: 'community_members.user_id',
      },
    },
  };

  async $beforeInsert() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    if (opt.patch && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
    this.updatedAt = new Date();
  }

  async verifyPassword(pass: string) {
    return bcrypt.compare(pass, this.password);
  }

  static get jsonSchema() {
    // TODO: add input DTO schema here
    // User.fromJson will call this
    return {
      type: 'object',
      properties: {
        password: {
          description: 'password of user',
          type: 'string',
        },
        email: {
          description: 'email of user',
          type: 'string',
        },
        fullname: {
          description: 'fullname of user',
          type: 'string',
        },
        username: {
          description: 'username of user',
          type: 'string',
        },
        locationId: {
          description: 'id of location',
          type: 'number',
        },
        imageId: {
          description: 'id of image',
          type: 'number',
        },
      },
      required: ['email', 'password', 'username', 'fullname', 'locationId'],
    };
  }

  $parseJson(json: Pojo, opt?: ModelOptions): Pojo {
    const _json = super.$parseJson(json, opt);
    const final = new User();
    final.username = _json.username;
    final.fullname = _json.fullname;
    final.locationId = _json.locationId;
    final.email = _json.email;
    final.password = _json.password;
    return final;
  }

  $formatJson(json: Pojo): Pojo {
    // TODO: add output DTO here
    const _json = super.$formatJson(json);
    _json.joinedIn = this.createdAt;
    delete _json.password;
    delete _json.createdAt;
    delete _json.updatedAt;
    delete _json.imageId;
    delete _json.locationId;
    return _json;
  }
}

export default User;
