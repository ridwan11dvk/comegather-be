import { Request, Response } from 'express';
import log4js from 'log4js';
import container from '../../inversify.config';
import TYPES from '../../../types';
import { ITopicController } from '../../../controller/ITopic';

const log = log4js.getLogger('TopicHandler');

export class TopicHandler {
  private controller: ITopicController;

  constructor() {
    this.controller = container.get<ITopicController>(TYPES.ITopicController);
  }

  async GetTopics(req: Request, res: Response) {
    try {
      const result = await this.controller.GetTopics();
      if (result.error) {
        return res.status(result.error.code).json({
          message: result.error.details,
        });
      }
      return res.status(200).json({
        data: result.result,
      });
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not get topic',
      });
    }
  }
}
