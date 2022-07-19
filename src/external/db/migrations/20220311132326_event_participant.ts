import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('event_participants', (t) => {
    t.increments('id');
    t.integer('event_id').notNullable().unsigned().references('id')
      .inTable('events')
      .onDelete('CASCADE');
    t.integer('user_id').notNullable().unsigned().references('id')
      .inTable('users')
      .onDelete('CASCADE');
    t.unique(['user_id', 'event_id']);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('event_participants');
}
