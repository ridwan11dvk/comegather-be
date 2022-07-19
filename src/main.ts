import dotenv from 'dotenv';
import log4js from 'log4js';
import logConf from './configs/logger';
import { App } from './infrastructure/app';

log4js.configure(logConf);
const log = log4js.getLogger('main');
dotenv.config();
const port = process.env.PORT || 5000;

const app = new App().express;
app.set('port', port);
app.listen(port, () => {
  log.info(`Running on port ${port}`);
});
