import { inject, injectable } from 'inversify';
import { UniqueViolationError } from 'objection';
import {
  Body, Example, Get, Path, Post, Request, Response, Route, Security, Tags,
} from 'tsoa';
import TYPES, { Result, UserRequest } from '../types';
// eslint-disable-next-line no-unused-vars
import { errorMsg } from '../models/dto';
import { IEvent } from '../models/dto/Event';
import { IEventUC } from '../usecase/IEvent';
import { ICommunityMemberUC } from '../usecase/ICommunityMember';
import { ICommunityUC } from '../usecase/ICommunity';
import { IEventController } from './IEvent';
import { IEParticipantUC } from '../usecase/IEParticipants';
import { IEParticipant } from '../models/dto/EventParticipant';

@Tags('Event')
@Route('events')
@injectable()
export class EventController implements IEventController {
  private CommunityUC: ICommunityUC;

  private CommunityMemberUC: ICommunityMemberUC;

  private EventUC: IEventUC;

  private EParticipantUC: IEParticipantUC;

  constructor(
    @inject(TYPES.ICommunityUC) CommunityUC: ICommunityUC,
    @inject(TYPES.ICommunityMemberUC) CommunityMemberUC: ICommunityMemberUC,
    @inject(TYPES.IEventUC) EventUC: IEventUC,
    @inject(TYPES.IEParticipantUC) EParticipantUC: IEParticipantUC,
  ) {
    this.CommunityUC = CommunityUC;
    this.CommunityMemberUC = CommunityMemberUC;
    this.EventUC = EventUC;
    this.EParticipantUC = EParticipantUC;
  }

  // @Get('/:EID')
  @Response<errorMsg>(500, 'server error', {
    message: 'Could not get events',
  })
  // TODO: add defaultResp
  async GetByID(@Path() EID: number): Promise<Result> {
    const event = await this.EventUC.GetByID(EID);
    const result = await this.EventUC.FetchRelations(event, ['participants']);
    if (!result) {
      return {
        error: {
          code: 500,
          details: 'Could not get events',
        },
      };
    }
    return { result };
  }

  // @Post('/:EID')
  @Security('accessToken')
  @Response<errorMsg>(404, 'event not found', {
    message: 'Event not found',
  })
  @Response<errorMsg>(404, 'community not found', {
    message: 'Community not found',
  })
  @Response<errorMsg>(403, 'not an admin', {
    message: 'You are not admin of related community',
  })
  @Response<errorMsg>(500, 'server error', {
    message: 'Could not update',
  })
  @Example({})
  async Update(
    @Request() req: UserRequest,
    @Path() EID: number,
    @Body() ievent: IEvent,
  ): Promise<Result> {
    const event = await this.EventUC.GetByID(EID);
    if (!event) {
      return {
        error: {
          code: 404,
          details: 'Event not found',
        },
      };
    }
    const community = await this.CommunityUC.GetByID(event.communityId);
    if (!community) {
      return {
        error: {
          code: 404,
          details: 'Community not found',
        },
      };
    }
    const isAdmin = await this.CommunityMemberUC.IsAdmin(community.id, req.user.id);
    if (!isAdmin) {
      return {
        error: {
          code: 403,
          details: 'You are not admin of related community',
        },
      };
    }
    const newEvent = ievent;
    newEvent.communityId = community.id;
    const success = await this.EventUC.UpdateByID(EID, newEvent);
    if (!success) {
      return {
        error: {
          code: 500,
          details: 'Could not update',
        },
      };
    }
    return {};
  }

  // @Delete('/:EID')
  @Security('accessToken')
  @Response<errorMsg>(404, 'event not found', {
    message: 'Event not found',
  })
  @Response<errorMsg>(404, 'community not found', {
    message: 'Community not found',
  })
  @Response<errorMsg>(403, 'not an admin', {
    message: 'You are not admin of related community',
  })
  @Response<errorMsg>(500, 'server error', {
    message: 'Could not delete',
  })
  @Example({})
  async Delete(@Request() req: UserRequest, @Path() EID: number): Promise<Result> {
    const event = await this.EventUC.GetByID(EID);
    if (!event) {
      return {
        error: {
          code: 404,
          details: 'Event not found',
        },
      };
    }
    const community = await this.CommunityUC.GetByID(event.communityId);
    if (!community) {
      return {
        error: {
          code: 404,
          details: 'Community not found',
        },
      };
    }
    const isAdmin = await this.CommunityMemberUC.IsAdmin(community.id, req.user.id);
    if (!isAdmin) {
      return {
        error: {
          code: 403,
          details: 'You are not admin of related community',
        },
      };
    }
    const success = await this.EventUC.DeleteByID(EID);
    if (!success) {
      return {
        error: {
          code: 500,
          details: 'Could not delete',
        },
      };
    }
    return {};
  }

  // @Get('/:EID/participants')
  @Response<errorMsg>(404, 'event not found', {
    message: 'Event not found',
  })
  @Response<errorMsg>(500, 'server error', {
    message: 'Could not get events',
  })
  @Example({
    data: {
      participants: [
        {
          id: 1,
          name: 'John Doe',
          email: '12asd@asd.com',
          phone: '123456789',
          isAdmin: false,
          isOwner: false,
        },
      ],
    },
  })
  async GetParticipants(@Path() EID: number): Promise<Result> {
    const event = await this.EventUC.GetByID(EID);
    const result = await this.EventUC.FetchRelations(event, ['participants_user']);
    if (!result) {
      return {
        error: {
          code: 500,
          details: 'Could not get events',
        },
      };
    }
    return { result };
  }

  @Get('/')
  @Response<errorMsg>(500, 'server error', {
    message: 'Could not get events',
  })
  @Example({
    data: {
      events: [
        {
          id: 1,
          name: 'Event 1',
          description: 'Event 1 description',
          startDate: '2020-01-01',
          endDate: '2020-01-01',
          communityId: 1,
          participants: [
            {
              id: 1,
              name: 'John Doe',
              email: 'johndoa@doe.com',
              phone: '123456789',
              isAdmin: false,
            },
          ],
        },
      ],
    },
  })
  async GetAll(): Promise<Result> {
    const events = await this.EventUC.GetAll();
    return {
      result: events,
    };
  }

  @Post('/:EID/join')
  @Security('accessToken')
  @Response<errorMsg>(404, 'event not found', {
    message: 'Event not found',
  })
  @Response<errorMsg>(404, 'community not found', {
    message: 'Community not found',
  })
  @Response<errorMsg>(403, 'Forbidden', {
    message: 'Event is full',
  })
  @Example({})
  async Join(@Request() req: UserRequest, @Path() EID: number): Promise<Result> {
    let event = await this.EventUC.GetByID(EID);
    if (!event.isPublic) {
      const membershipStatus = this.CommunityMemberUC
        .GetMembershipStatus(event.communityId, req.user.id);
      if (!membershipStatus) {
        return {
          error: {
            code: 403,
            details: 'Forbidden, event is not for public',
          },
        };
      }
    }
    event = await this.EventUC.FetchRelations(event, ['participants']);
    if (event.capacity === event.participants.length) {
      return {
        error: {
          code: 403,
          details: 'Forbidden, event is full',
        },
      };
    }
    const eventParticipant: IEParticipant = {
      eventId: EID,
      userId: req.user.id,
    };
    try {
      await this.EParticipantUC.Create(eventParticipant);
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        return {
          error: {
            code: 403,
            details: 'You already joined in this event',
          },
        };
      }
      throw error;
    }
    return {};
  }

  async Leave(@Request() req: UserRequest, @Path() EID: number): Promise<Result> {
    const eventParticipant: IEParticipant = {
      eventId: EID,
      userId: req.user.id,
    };
    await this.EParticipantUC.Delete(eventParticipant);
    // Idempoten
    return {};
  }
}
