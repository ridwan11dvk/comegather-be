import faker from '@faker-js/faker';
import { Knex } from 'knex';
import { LOCATION_SIZE } from './2_locations';

export const COMMUNITY_SIZE = 20;

const communities = [
  { name: 'Komunitas IT', description: 'Komunitas IT', location_id: 1 },
  { name: 'Komunitas Otomotif', description: 'Komunitas ', location_id: 2 },
  { name: 'Komunitas Teknologi', description: 'Komunitas Teknologi', location_id: 3 },
];

// eslint-disable-next-line no-plusplus
for (let i = 0; i < COMMUNITY_SIZE; i++) {
  communities.push({
    name: faker.company.companyName(),
    description: faker.lorem.sentence(),
    location_id: faker.datatype.number({ min: 1, max: LOCATION_SIZE }),
  });
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('communities').del();

  // Inserts seed entries
  await knex('communities').insert(communities);
}
