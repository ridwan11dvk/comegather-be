import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('communities', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('slug').nullable();
    table.string('description').nullable();
    table.integer('location_id').nullable();
    table.integer('image_id').nullable();
    table.timestamps(true, true);
    table.foreign('location_id').references('locations.id').onUpdate('CASCADE').onDelete('CASCADE');
    table.foreign('image_id').references('files.id').onUpdate('CASCADE').onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('communities');
}
