import knex from 'knex';
import { Model } from 'objection';
import { IUserController } from '../../controller/IUser';
import { mockUserTable } from '../../entities/User.mock';
import { IUser } from '../../models/dto/User';
import TYPES from '../../types';
import container from '../inversify.config.mock';
import connector from '../../external/db/knexfile';

const controller = container.get<IUserController>(TYPES.IUserController);

// TODO: create db for testing. DB needed so this can run
const db = knex(connector.development);
Model.knex(db);

describe('User controller', () => {
  beforeAll((done) => {
    done();
  });

  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await db.destroy();
  });
  it('Create user success', async () => {
    const mockData: IUser = {
      email: 'weebs@wibu.com',
      password: 'weebS12*',
      password1: 'weebS12*',
      fullname: 'weebs',
      username: 'weebs',
      locationId: 1,
      interests: [1],
    };
    const result = await controller.Register(mockData);
    expect(result.error).toBeUndefined();
    expect(result.result).toEqual(mockData.email);
    expect(mockData).toMatchObject(mockUserTable.table[mockUserTable.table.length - 1]);
  });
});
