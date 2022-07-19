import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('events', (t) => {
    t.increments('id');
    t.string('title').notNullable();
    t.text('description', 'longtext');
    t.string('public_id');
    t.string('slug');
    t.dateTime('started_at').notNullable();
    t.dateTime('ended_at');
    t.boolean('is_public').notNullable().defaultTo(true);
    t.integer('community_id').unsigned()
      .references('id').inTable('communities')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    t.integer('image_id').nullable().unsigned().references('id')
      .inTable('files')
      .onDelete('SET NULL');
    t.enu('type', ['onsite', 'online']).notNullable().defaultTo('online');
    t.string('site').notNullable();
    t.integer('capacity').notNullable();
    t.string('additional_info');
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('events');
}
