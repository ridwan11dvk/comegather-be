import log4js from 'log4js';
import { createClient } from 'redis';

const host = process.env.REDIS_HOST || 'localhost';

const log = log4js.getLogger('redis');

export const clientRedis = createClient({
  socket: {
    host,
    port: 6379,
  },
});

export const getRedisReady = async () => {
  await clientRedis.connect();
  log.info(await clientRedis.ping());
};
