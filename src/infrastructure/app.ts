import express from 'express';
import knex from 'knex';
import { Model } from 'objection';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import path from 'path';
import connector from '../external/db/knexfile';
import v1_router from './rest/routes/v1/api_v1';
import { getRedisReady } from '../external/redis';

export class App {
  express = express();

  constructor() {
    this.express = express();
    App.setupDB();
    App.setupRedis();
    this.setupMiddleware();
  }

  static setupRedis() {
    getRedisReady();
  }

  static setupDB() {
    const db = knex(process.env.NODE_ENV === 'development' ? connector.development : connector.production);
    Model.knex(db);
  }

  private setupMiddleware() {
    this.express.use(cors({
      origin: true,
      credentials: true,
    }));
    this.express.use(cookieParser());
    this.express.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    this.express.use(bodyParser.json({ limit: '50mb' }));
    this.express.use(passport.initialize());
    this.express.use('/api/v1', v1_router);
    this.express.use('/public', express.static(path.join(__dirname, '../../public/')));
  }
}
