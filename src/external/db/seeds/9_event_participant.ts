import { faker } from '@faker-js/faker';
import { Knex } from 'knex';
import { EVENT_SIZE } from './5_event';
import { USER_SIZE } from './7_user';

const EVENT_PARTICIPANT_SIZE = 20;

const event_participants = [
  { event_id: 1, user_id: 1 },
];

// eslint-disable-next-line no-plusplus
for (let i = 1; i < EVENT_PARTICIPANT_SIZE; i++) {
  event_participants.push({
    event_id: faker.datatype.number({ min: 1, max: EVENT_SIZE }),
    user_id: faker.datatype.number({ min: 1, max: USER_SIZE }),
  });
}

const unique = [
  ...new Map(event_participants.map((item) => [JSON.stringify(item), item])).values(),
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('event_participants').del();

  // Inserts seed entries
  await knex('event_participants').insert(unique);
}
