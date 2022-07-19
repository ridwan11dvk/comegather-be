/**
 * KnexFile is the configuration file for 3 types of functions:
 * 1. Knex migration server.
 * 2. Knex query.
 * 3. Objection orm query.
 */
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

// Database connection configuration.
export const connection = {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

// Client package and main database query connector.
export const client = 'pg';

export default {
  development: {
    client,
    connection,
    pool: {
      min: 0,
      max: 20,
    },
    migration: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: `${__dirname}/seeds`,
    },
  },
  staging: {
    client,
    connection,
    pool: {
      min: 0,
      max: 20,
    },
    migration: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: `${__dirname}/seeds`,
    },
  },
  production: {
    client,
    connection,
    pool: {
      min: 0,
      max: 20,
    },
    migration: {
      tableName: 'knex_migrations',
    },
  },
};
