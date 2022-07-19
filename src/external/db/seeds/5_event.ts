import { faker } from '@faker-js/faker';
import { Knex } from 'knex';
import { COMMUNITY_SIZE } from './4_communities';

export const EVENT_SIZE = 20;

const events = [
  {
    title: 'Event IT', description: 'Event IT', public_id: 'event-it-1', slug: 'event-it', started_at: new Date(), ended_at: new Date(), community_id: 1, is_public: true, type: 'onsite', site: 'https://www.google.com', capacity: 100, additional_info: 'additional info',
  },
];

// eslint-disable-next-line no-plusplus
for (let i = 0; i < EVENT_SIZE; i++) {
  events.push(
    {
      title: faker.company.companyName(),
      description: faker.lorem.sentence(),
      public_id: faker.datatype.uuid(),
      slug: faker.lorem.slug(),
      started_at: new Date(new Date().setDate(new Date().getDate() + i)),
      ended_at: new Date(new Date().setDate(new Date().getDate() + i + faker.datatype.number({ min: 1, max: 10 }))),
      is_public: faker.datatype.boolean(),
      type: faker.random.arrayElement(['onsite', 'online']),
      site: faker.internet.url(),
      capacity: faker.datatype.number({ min: 1, max: 100 }),
      community_id: faker.datatype.number({ min: 1, max: COMMUNITY_SIZE }),
      // image_id: faker.datatype.number({ min: 1, max: FILE_SIZE }),
      additional_info: faker.lorem.sentence(),
    },
  );
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('events').del();

  // Inserts seed entries
  await knex('events').insert(events);
}
