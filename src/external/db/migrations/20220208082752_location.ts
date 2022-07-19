import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('locations', (table) => {
    table.increments('id');
    table.string('city').notNullable();
    table.string('stateProvince').notNullable();
    table.string('country').notNullable();
    table.string('postalCode').notNullable();
    table.timestamps(true, true);
  }).alterTable('users', (table) => {
    table.foreign('location_id').references('locations.id').onUpdate('CASCADE').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.dropForeign('location_id');
  }).dropTable('locations');
}
