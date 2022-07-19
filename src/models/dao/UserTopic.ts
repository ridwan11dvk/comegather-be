import { Pojo } from 'objection';
import Generic from './Generic';

class UserTopic extends Generic {
  userId!: number;

  topicId!: number;

  static pickJsonSchemaProperties = true;

  static get tableName() {
    return 'user_topics';
  }

  static get jsonSchema() {
    // TODO: add input DTO here
    // User.fromJson will call this
    return {
      type: 'object',
      properties: {
        userId: {
          description: 'id of the user',
          type: 'integer',
        },
        topicId: {
          description: 'id of the topic',
          type: 'integer',
        },
      },
      required: ['userId', 'topicId'],
    };
  }

  $formatJson(json: Pojo): Pojo {
    // TODO: add output DTO here
    return super.$formatJson(json);
  }
}

export default UserTopic;
