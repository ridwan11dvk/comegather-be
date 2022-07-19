import { faker } from '@faker-js/faker';
import { Knex } from 'knex';

const COM_MEMBER_SIZE = 20;

const community_member = [
  { community_id: 1, user_id: 1, is_admin: true },
];

// eslint-disable-next-line no-plusplus
for (let i = 1; i < COM_MEMBER_SIZE; i++) {
  community_member.push({
    community_id: i + 1, user_id: i + 1, is_admin: faker.datatype.boolean(),
  });
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('community_members').del();

  // Inserts seed entries
  await knex('community_members').insert(community_member);
}
