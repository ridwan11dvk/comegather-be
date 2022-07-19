import { Model, Pojo } from 'objection';
import Community from './Community';
import Generic from './Generic';
import User from './User';

class CommunityMember extends Generic {
  communityId!: number;

  userId!: number;

  isAdmin!: boolean;

  static pickJsonSchemaProperties = true;

  static get tableName() {
    return 'community_members';
  }

  static get jsonSchema() {
    // TODO: add input DTO here
    // User.fromJson will call this
    return {
      type: 'object',
      properties: {
        communityId: {
          description: 'id of the community',
          type: 'integer',
        },
        userId: {
          description: 'id of the user',
          type: 'integer',
        },
        isAdmin: {
          description: 'is the user an admin',
          type: 'boolean',
        },
      },
      required: ['communityId', 'userId', 'isAdmin'],
    };
  }

  static relationMappings = {
    community: {
      relation: Model.BelongsToOneRelation,
      modelClass: Community,
      join: {
        from: 'community_members.community_id',
        to: 'communities.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'community_members.user_id',
        to: 'users.id',
      },
    },
  };

  $formatJson(json: Pojo): Pojo {
    // TODO: add output DTO here
    return super.$formatJson(json);
  }
}

export default CommunityMember;
