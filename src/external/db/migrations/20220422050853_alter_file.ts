import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('files', (t) => {
    t.boolean('in_used').defaultTo(false);
  }).alterTable('communities', (t) => {
    t.integer('banner_image_id').nullable();
    t.foreign('banner_image_id').references('files.id').onUpdate('CASCADE').onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('communities', (t) => {
    t.dropForeign('banner_image_id');
    t.dropColumn('banner_image_id');
  }).alterTable('files', (t) => {
    t.dropColumn('in_used');
  });
}
