import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_topics', (table) => {
    table.increments('id');
    table.integer('user_id').unsigned().notNullable();
    table.integer('topic_id').unsigned().notNullable();
    table.timestamps(true, true);
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
    table.foreign('topic_id').references('topics.id').onUpdate('CASCADE').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_topics');
}
