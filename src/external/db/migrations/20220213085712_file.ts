import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('files', (table) => {
    table.increments('id');
    table.string('file_name').notNullable();
    table.string('mime_type').notNullable();
    table.string('url').notNullable();
    table.integer('size').notNullable();
    table.timestamps(true, true);
  }).alterTable('users', (table) => {
    table.integer('image_id').nullable();
    table.foreign('image_id').references('files.id').onUpdate('CASCADE').onDelete('SET NULL');
  }).alterTable('topics', (table) => {
    table.integer('image_id').nullable();
    table.foreign('image_id').references('files.id').onUpdate('CASCADE').onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('topics', (table) => {
    table.dropForeign('image_id');
    table.dropColumn('image_id');
  }).alterTable('users', (table) => {
    table.dropForeign('image_id');
    table.dropColumn('image_id');
  }).dropTable('files');
}
