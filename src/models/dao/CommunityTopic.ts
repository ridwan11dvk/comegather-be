import { Pojo } from 'objection';
import Generic from './Generic';

class CommunityTopic extends Generic {
  communityId!: number;

  topicId!: number;

  static pickJsonSchemaProperties = true;

  static get tableName() {
    return 'community_topics';
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
        topicId: {
          description: 'id of the topic',
          type: 'integer',
        },
      },
      required: ['communityId', 'topicId'],
    };
  }

  $formatJson(json: Pojo): Pojo {
    // TODO: add output DTO here
    return super.$formatJson(json);
  }
}

export default CommunityTopic;
