import { Knex } from 'knex';

export const LOCATION_SIZE = 4;

// custom made
const locations = [
  {
    city: 'Bandung', stateProvince: 'Jawa Barat', country: 'Indonesia', postalCode: '40135',
  },
  {
    city: 'Jakarta', stateProvince: 'DKI Jakarta', country: 'Indonesia', postalCode: '40136',
  },
  {
    city: 'Surabaya', stateProvince: 'Jawa Timur', country: 'Indonesia', postalCode: '40137',
  },
  {
    city: 'Semarang', stateProvince: 'Jawa Tengah', country: 'Indonesia', postalCode: '40138',
  },
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('locations').del();

  // Inserts seed entries
  await knex('locations').insert(locations);
}
