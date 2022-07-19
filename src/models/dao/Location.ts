import { Model, Pojo } from 'objection';
import Generic from './Generic';
import User from './User';

class Location extends Generic {
  city!: string;

  stateProvince!: string;

  country!: string;

  postalCode!: string;

  static pickJsonSchemaProperties = true;

  static get tableName() {
    return 'locations';
  }

  static relationMappings = {
    user: {
      relation: Model.HasManyRelation,
      modelClass: User,
      join: {
        from: 'locations.id',
        to: 'users.locationId',
      },
    },
  };

  static get jsonSchema() {
    // TODO: add input DTO here
    // User.fromJson will call this
    return {
      type: 'object',
      properties: {
        city: {
          description: 'city of the location',
          type: 'string',
        },
        stateProvince: {
          description: 'stateProvince of the location',
          type: 'string',
        },
        country: {
          description: 'country of the location',
          type: 'string',
        },
        postalCode: {
          description: 'postalCode of the location',
          type: 'string',
        },
      },
      required: ['city', 'stateProvince', 'country', 'postalCode'],
    };
  }

  $formatJson(json: Pojo): Pojo {
    // TODO: add output DTO here
    return super.$formatJson(json);
  }
}

export default Location;
