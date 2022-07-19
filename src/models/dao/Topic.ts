import { Model, Pojo } from 'objection';
import Generic from './Generic';
import User from './User';

class Topic extends Generic {
  name!: string;

  description?: string;

  imageId?: number;

  static pickJsonSchemaProperties = true;

  static get tableName() {
    return 'topics';
  }

  static relationMappings = {
    user: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'topics.id',
        through: {
          from: 'user_topics.topic_id',
          to: 'user_topics.user_id',
        },
        to: 'users.id',
      },
    },
  };

  static get jsonSchema() {
    // TODO: add input DTO here
    // User.fromJson will call this
    return {
      type: 'object',
      properties: {
        name: {
          description: 'name of the topic',
          type: 'string',
        },
        description: {
          description: 'description of the topic',
          type: 'string',
        },
        imageId: {
          description: 'image id of the topic',
          type: 'number',
        },
      },
      required: ['name'],
    };
  }

  $formatJson(json: Pojo): Pojo {
    // TODO: add output DTO here
    return super.$formatJson(json);
  }
}

export default Topic;
