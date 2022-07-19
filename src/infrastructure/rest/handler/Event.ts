import { Request, Response } from 'express';
import log4js from 'log4js';
import container from '../../inversify.config';
import TYPES, { UserRequest } from '../../../types';
import { IEventController } from '../../../controller/IEvent';

const log = log4js.getLogger('EventHandler');

export class EventHandler {
  private controller: IEventController;

  constructor() {
    this.controller = container.get<IEventController>(TYPES.IEventController);
  }

  async GetAll(_: Request, res: Response) {
    try {
      const result = await this.controller.GetAll();
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not get events',
      });
    }
  }

  async Join(req: UserRequest, res: Response) {
    const { EID } = req.params;
    const eid = parseInt(`${EID}`, 10);
    if (Number.isNaN(eid)) {
      return res.status(400).json({
        message: 'Invalid event id',
      });
    }
    try {
      const result = await this.controller.Join(req, eid);
      if (result.error) {
        return res.status(result.error.code).json({
          message: result.error.details,
        });
      }
      return res.sendStatus(200);
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not join events',
      });
    }
  }
}
