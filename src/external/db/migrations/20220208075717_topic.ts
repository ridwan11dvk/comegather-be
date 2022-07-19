import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('topics', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('description').nullable();
    table.timestamps(true, true);
    table.index(['name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('topics');
}
