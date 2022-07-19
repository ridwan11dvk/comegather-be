import { Knex } from 'knex';
import faker from '@faker-js/faker';

export const FILE_SIZE = 20;

const files = [
  {
    file_name: 'Spesifikasi Perangkat Lunak CommunITree', mime_type: 'application/pdf', url: './SKPL-Communitree.pdf', size: 123,
  },
  {
    file_name: 'Foto User', mime_type: 'image/png', url: './foto.png', size: 13,
  },
];

// eslint-disable-next-line no-plusplus
for (let i = 0; i < FILE_SIZE; i++) {
  files.push({
    file_name: faker.system.fileName(),
    mime_type: faker.system.mimeType(),
    url: faker.system.filePath(),
    size: faker.datatype.number({ min: 1, max: FILE_SIZE }),
  });
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('files').del();

  // Inserts seed entries
  await knex('files').insert(files);
}
