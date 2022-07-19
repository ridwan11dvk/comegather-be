import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { Knex } from 'knex';
import { LOCATION_SIZE } from './2_locations';

export const USER_SIZE = 20;

const salt = bcrypt.genSaltSync();

const users = [
  {
    email: 'gmail@alexander.com', fullname: 'gmail alexander com', username: 'gmail', password: bcrypt.hashSync('password', salt), location_id: 1, last_login: new Date(),
  },
];

// eslint-disable-next-line no-plusplus
for (let i = 1; i < USER_SIZE; i++) {
  users.push({
    email: faker.internet.email(),
    fullname: faker.name.findName(),
    username: faker.internet.userName(),
    password: bcrypt.hashSync(faker.internet.password(), salt),
    location_id: faker.datatype.number({ min: 1, max: LOCATION_SIZE }),
    last_login: faker.date.past(),
    // image_id: faker.datatype.number({ min: 1, max: FILE_SIZE }),
  });
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert(users);
}
