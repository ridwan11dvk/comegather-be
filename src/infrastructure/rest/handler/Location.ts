import { Request, Response } from 'express';
import log4js from 'log4js';
import container from '../../inversify.config';
import { ILocationController } from '../../../controller/ILocation';
import TYPES from '../../../types';

const log = log4js.getLogger('LocationHandler');

export class LocationHandler {
  private controller: ILocationController;

  constructor() {
    this.controller = container.get<ILocationController>(TYPES.ILocationController);
  }

  async GetLocations(req: Request, res: Response) {
    try {
      const result = await this.controller.GetLocations();
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
        message: 'Could not get locations',
      });
    }
  }
}
