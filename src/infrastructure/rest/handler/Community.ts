import { Request, Response } from 'express';
import log4js from 'log4js';
import { ForeignKeyViolationError } from 'objection';
import container from '../../inversify.config';
import { ICommunityController } from '../../../controller/ICommunity';
import { isICommunity } from '../../../models/dto/Community';
import TYPES, { UserRequest } from '../../../types';
import { isIEvent } from '../../../models/dto/Event';

const log = log4js.getLogger('CommunityHandler');

export class CommunityHandler {
  private controller: ICommunityController;

  constructor() {
    this.controller = container.get<ICommunityController>(TYPES.ICommunityController);
  }

  async Create(req: UserRequest, res: Response) {
    const icommunity = req.body;
    if (!isICommunity(icommunity)) {
      return res.status(422).json({
        message: 'Failed during input validation',
      });
    }
    try {
      const result = await this.controller.Create(req, icommunity);
      if (result.error) {
        return res.status(result.error.code).json({
          message: result.error.details,
        });
      }
      return res.status(201).json({
        data: result.result,
      });
    } catch (err) {
      log.error(err.message);
      if (err instanceof ForeignKeyViolationError) {
        return res.status(403).json({
          message: 'Location id is not valid',
        });
      }
      return res.status(500).json({
        message: 'Could not create community',
      });
    }
  }

  async CreateEvent(req: UserRequest, res: Response) {
    const reqBody = req.body;
    if (!isIEvent(reqBody)) {
      return res.status(422).json({
        message: 'Failed during input validation',
      });
    }
    const { CID } = req.params;
    const cid = parseInt(`${CID}`, 10);
    if (Number.isNaN(cid)) {
      return res.status(400).json({
        message: 'Invalid community id',
      });
    }
    reqBody.communityId = cid;
    try {
      const result = await this.controller.CreateEvent(req, cid, reqBody);
      if (result.error) {
        return res.status(result.error.code).json({
          message: result.error.details,
        });
      }
      return res.status(201).json({
        data: result.result,
      });
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not create event',
      });
    }
  }

  async GetEvents(req: Request, res: Response) {
    const { CID } = req.params;
    const { upcoming } = req.query;
    const cid = parseInt(`${CID}`, 10);
    if (Number.isNaN(cid)) {
      return res.status(400).json({
        message: 'Invalid community id',
      });
    }
    const flag = `${upcoming}` !== 'false';
    try {
      const result = await this.controller.GetEvents(cid, flag);
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
        message: 'Could not get events',
      });
    }
  }

  async GetCommunities(req: Request, res: Response) {
    try {
      const result = await this.controller.GetCommunities();
      const { error } = result;
      if (error) {
        return res.status(error.code).json({
          message: error.details,
        });
      }
      return res.status(200).json({
        data: result.result,
      });
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not get communities',
      });
    }
  }

  async Update(req: UserRequest, res: Response) {
    const reqBody = req.body;
    const { CID } = req.params;
    const cid = parseInt(`${CID}`, 10);
    if (Number.isNaN(cid)) {
      return res.status(400).json({
        message: 'Invalid community id',
      });
    }
    if (!isICommunity(reqBody)) {
      return res.status(422).json({
        message: 'Failed during input validation',
      });
    }
    try {
      const result = await this.controller.Update(req, cid, reqBody);
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
      if (err instanceof ForeignKeyViolationError) {
        return res.status(403).json({
          message: 'LocationId or interests is not valid',
        });
      }
      return res.status(500).json({
        message: 'Could not update community',
      });
    }
  }

  async GetCommunityDetail(req: Request, res: Response) {
    const { CID } = req.params;
    const cid = parseInt(`${CID}`, 10);
    if (Number.isNaN(cid)) {
      return res.status(400).json({
        message: 'Invalid community id',
      });
    }
    try {
      const result = await this.controller.GetCommunityDetail(cid);
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
        message: 'Could not get community detail',
      });
    }
  }

  async GetMembersId(req: UserRequest, res: Response) {
    const { CID } = req.params;
    const cid = parseInt(`${CID}`, 10);
    if (Number.isNaN(cid)) {
      return res.status(400).json({
        message: 'Invalid community id',
      });
    }
    try {
      const result = await this.controller.GetMembersId(req, cid);
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
        message: 'Could not get community members',
      });
    }
  }

  async GetMembersCount(req: Request, res: Response) {
    const { CID } = req.params;
    const cid = parseInt(`${CID}`, 10);
    if (Number.isNaN(cid)) {
      return res.status(400).json({
        message: 'Invalid community id',
      });
    }
    try {
      const result = await this.controller.GetMembersCount(cid);
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
        message: 'Could not get community members count',
      });
    }
  }

  async GetMembershipStatus(req: UserRequest, res: Response) {
    const { CID } = req.params;
    const cid = parseInt(`${CID}`, 10);
    if (Number.isNaN(cid)) {
      return res.status(400).json({
        message: 'Invalid community id',
      });
    }
    try {
      const result = await this.controller.GetMembershipStatus(req, cid);
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
        message: 'Could not get member status',
      });
    }
  }

}
