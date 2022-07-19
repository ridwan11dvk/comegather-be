import { Knex } from 'knex';
import faker from '@faker-js/faker';

const TOPIC_SIZE = 20;

// custom made
const topics = [
  { name: 'programming', description: 'create a program' },
  { name: 'math', description: 'calculate' },
  { name: 'science', description: 'do science' },
  { name: 'history', description: 'learn about history' },
  { name: 'geography', description: 'learn about geography' },
  { name: 'music', description: 'play music' },
  { name: 'art', description: 'draw art' },
  { name: 'sports', description: 'play sports' },
  { name: 'food', description: 'eat food' },
  { name: 'travel', description: 'travel' },
  { name: 'fashion', description: 'wear fashion' },
  { name: 'literature', description: 'read literature' },
  { name: 'engineering', description: 'effective yet efficient' },
];

// faker
// eslint-disable-next-line no-plusplus
for (let i = 0; i < TOPIC_SIZE; i++) {
  topics.push({
    name: faker.commerce.department(),
    description: faker.lorem.sentence(),
  });
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('topics').del();

  // Inserts seed entries
  await knex('topics').insert(topics);
}
