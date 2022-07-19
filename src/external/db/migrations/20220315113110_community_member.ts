import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('community_members', (table) => {
    table.increments('id');
    table.integer('community_id').notNullable();
    table.integer('user_id').notNullable();
    table.boolean('is_admin').notNullable();
    table.unique(['community_id', 'user_id']);
    table.index(['community_id', 'user_id'], 'community_member_index');
    table.timestamps(true, true);
    table.foreign('community_id').references('communities.id').onUpdate('CASCADE').onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('community_members');
}
