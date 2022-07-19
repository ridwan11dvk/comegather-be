import { inject, injectable } from 'inversify';
import Objection, { Model } from 'objection';
import {
  Body,
  Example, Get, Path, Post, Put, Query, Request, Response, Route, Security, SuccessResponse, Tags,
} from 'tsoa';
// import log4js from 'log4js';
import TYPES, { Result, UserRequest } from '../types';
import { ICommunityUC } from '../usecase/ICommunity';
import { ICommunityTopicUC } from '../usecase/ICommunityTopic';
import { ICommunityMemberUC } from '../usecase/ICommunityMember';
import { ICommunityController } from './ICommunity';
import { defaultResp, errorMsg } from '../models/dto';
import { ICommunity, IAdminIds } from '../models/dto/Community';
import { IEvent } from '../models/dto/Event';
import { IEventUC } from '../usecase/IEvent';
import { IFileUC } from '../usecase/IFile';
import Event from '../models/dao/Event';
import Community from '../models/dao/Community';

// const log = log4js.getLogger('CommunityHandler');
@Tags('Community')
@Route('communities')
@injectable()
export class CommunityController implements ICommunityController {
  private CommunityUC: ICommunityUC;

  private CommunityTopicUC: ICommunityTopicUC;

  private CommunityMemberUC: ICommunityMemberUC;

  private EventUC: IEventUC;

  private FileUC: IFileUC;

  constructor(
    @inject(TYPES.ICommunityUC) CommunityUC: ICommunityUC,
    @inject(TYPES.ICommunityTopicUC) CommunityTopicUC: ICommunityTopicUC,
    @inject(TYPES.ICommunityMemberUC) CommunityMemberUC: ICommunityMemberUC,
    @inject(TYPES.IEventUC) EventUC: IEventUC,
    @inject(TYPES.IFileUC) FileUC: IFileUC,
  ) {
    this.CommunityUC = CommunityUC;
    this.CommunityTopicUC = CommunityTopicUC;
    this.CommunityMemberUC = CommunityMemberUC;
    this.EventUC = EventUC;
    this.FileUC = FileUC;
  }

  /**
   * Create events in a community
   * @param CID Community ID
   * @param upcoming true to get upcoming events or false to get past events
   */
  @Post('/{CID}/events')
  @SuccessResponse(200, 'Ok')
  @Example({
    data: {
      id: 1,
    },
  })
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Failed to get community',
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Community not found',
  })
  @Response<errorMsg>(403, 'Unathorized', {
    message: 'You are not an admin of this community',
  })
  async CreateEvent(
    @Request() req: UserRequest,
    @Path() CID: number,
    @Body() ievent: IEvent,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const community = await this.CommunityUC.GetByID(CID);
      if (!community) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      const isAdmin = await this.CommunityMemberUC.IsAdmin(community.id, req.user.id);
      if (!isAdmin) {
        await trx.rollback();
        return {
          error: {
            code: 403,
            details: 'You are not admin of this community',
          },
        };
      }
      if (ievent.imageId) {
        const image = await this.FileUC.GetByID(ievent.imageId);
        if (!image) {
          await trx.rollback();
          return {
            error: {
              code: 404,
              details: 'File not found',
            },
          };
        }
        const success = await this.FileUC.PatchInUseByID(image.id, trx);
        if (!success) {
          await trx.rollback();
          return {
            error: {
              code: 500,
              details: 'Unable to patch file in use',
            },
          };
        }
      }
      const eventId = await this.EventUC.Create(ievent, trx);
      if (!eventId) {
        await trx.rollback();
        return {
          error: {
            code: 500,
            details: 'Unable to create event',
          },
        };
      }
      await trx.commit();
      return {
        result: {
          id: eventId,
        },
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Get events in a community
   * @param CID Community ID
   * @param upcoming true to get upcoming events or false to get past events
   */
  @Get('/{CID}/events')
  @SuccessResponse(200, 'Ok')
  @Example({
    data: {
      id: 1,
      name: 'Komunitas IT',
      slug: null,
      description: 'Komunitas IT',
      createdAt: '2022-04-01T20:07:48.687Z',
      updatedAt: '2022-04-01T20:07:48.687Z',
      events: [],
    },
  })
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Failed to get community',
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Community not found',
  })
  async GetEvents(
    @Path() CID: number,
    @Query() upcoming: boolean,
  ): Promise<Result> {
    const community = await this.CommunityUC.GetByID(CID);
    if (!community) {
      return {
        error: {
          code: 404,
          details: 'Community not found',
        },
      };
    }
    let modify = (builder: Objection.QueryBuilder<Event>) => {
      builder.where('events.started_at', '<', new Date()).orderBy('events.id', 'desc');
    };
    if (upcoming) {
      modify = (builder: Objection.QueryBuilder<Event>) => {
        builder.where('events.started_at', '>', new Date()).orderBy('events.id', 'asc');
      };
    }
    const result = await this.CommunityUC.FetchRelations(community, ['events(modify).participants'], { modify });
    return { result };
  }

  /**
   * Retrieves a community's detail
   * @param CID The community's ID
   */
  @Get('/:CID')
  // Security kalau make middleware isauth. defaultnya accessToken
  @Security('accessToken')
  // Pesan error
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Could not get community detail',
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Community not found',
  })
  // Pesan sukses
  @Example<defaultResp>({
    data: {
      id: 1,
      name: 'Komunitas IT',
      slug: 'komunitas-it',
      description: 'Komunitas hantu bawa balon',
      locationId: 1,
      imageId: 1,
      createdAt: '2022-03-18T14:34:40.159Z',
      updatedAt: '2022-03-18T14:34:40.159Z',
    },
  })
  async GetCommunityDetail(
    @Path() CID: number,
  ): Promise<Result> {
    const community = await this.CommunityUC.GetByID(CID);
    if (!community) {
      return {
        error: {
          code: 404,
          details: 'Community not found',
        },
      };
    }
    const result = await this.CommunityUC.FetchRelations(community, ['hasTags', 'locatedOn', 'hasImage', 'hasBanner']);
    if (!result) {
      return {
        error: {
          code: 500,
          details: 'Could not get community detail, ask administrator',
        },
      };
    }
    return {
      result,
    };
  }

  /**
   * Retrieves a community's members
   * @param CID The community's ID
   */
  @Get('/:CID/members')
  @Security('accessToken')
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Could not get community members',
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Community not found',
  })
  @Example<defaultResp>({
    data: [
      {
        id: 1,
      },
    ],
  })
  async GetMembersId(
    @Request() req: UserRequest,
    @Path() CID: number,
  ): Promise<Result> {
    const isAdmin = await this.CommunityMemberUC.IsAdmin(req.user.id, CID);
    if (!isAdmin) {
      return {
        error: {
          code: 403,
          details: 'You are not admin of this community',
        },
      };
    }
    const members = await this.CommunityMemberUC.GetMembersId(CID);
    if (!members) {
      return {
        error: {
          code: 404,
          details: 'Community not found',
        },
      };
    }
    return {
      result: members,
    };
  }

  /**
   * Retrieves a community's members count
   * @param CID The community's ID
   */
  @Get('/:CID/members/count')
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Could not get community members count',
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Community not found',
  })
  @Example<defaultResp>({
    data: 9,
  })
  async GetMembersCount(
    @Path() CID: number,
  ): Promise<Result> {
    const membersCount = (await this.CommunityMemberUC.GetMembersId(CID)).length;
    if (!membersCount) {
      return {
        error: {
          code: 404,
          details: 'Community not found',
        },
      };
    }
    return {
      result: membersCount,
    };
  }

  /**
   * Creates a new community and set the creator as admin
   */
  @Post('/')
  @Security('accessToken')
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Failed to create community',
  })
  @SuccessResponse(201, 'Successfully created community')
  @Example<defaultResp>({
    data: 'communitree',
  })
  async Create(
    @Request() req: UserRequest,
    @Body() icommunity: ICommunity,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      // create community
      const communityId = await this.CommunityUC.Create(icommunity, trx);
      if (icommunity.tagIds) {
        // set community topics
        const successCommunityTopics: Promise<number>[] = [];
        icommunity.tagIds.forEach(
          (id) => successCommunityTopics.push(
            this.CommunityTopicUC.Create({ communityId, topicId: id }, trx),
          ),
        );
        await Promise.all(successCommunityTopics);
      }
      // creator join community and set creator as admin
      const successSetAdmin = await this.CommunityMemberUC
        .JoinCommunity(communityId, req.user.id, true, trx);
      if (!successSetAdmin) {
        await trx.rollback();
        return {
          error: {
            code: 500,
            details: 'Failed to set creator as admin',
          },
        };
      }

      if (icommunity.imageId) {
        const image = await this.FileUC.GetByID(icommunity.imageId);
        if (!image) {
          await trx.rollback();
          return {
            error: {
              code: 404,
              details: 'File not found',
            },
          };
        }
        const success = await this.FileUC.PatchInUseByID(image.id, trx);
        if (!success) {
          await trx.rollback();
          return {
            error: {
              code: 500,
              details: 'Unable to patch file in use',
            },
          };
        }
      }
      if (icommunity.bannerImageId) {
        const image = await this.FileUC.GetByID(icommunity.bannerImageId);
        if (!image) {
          await trx.rollback();
          return {
            error: {
              code: 404,
              details: 'File not found',
            },
          };
        }
        const success = await this.FileUC.PatchInUseByID(image.id, trx);
        if (!success) {
          await trx.rollback();
          return {
            error: {
              code: 500,
              details: 'Unable to patch file in use',
            },
          };
        }
      }
      await trx.commit();
      return {
        result: icommunity.name,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Get all communities
   */
  @Get('/')
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Failed to retrieve communities',
  })
  @Example<defaultResp>({
    data: [
      {
        id: 20,
        name: 'Komunitas IT',
        slug: null,
        description: 'Komunitas IT',
        createdAt: '2022-04-01T18:36:39.146Z',
        updatedAt: '2022-04-01T18:36:39.146Z',
        hasTags: [],
        locatedOn: null,
        hasImage: null,
      },
      {
        id: 21,
        name: 'Komunitas Otomotif',
        slug: null,
        description: 'Komunitas ',
        createdAt: '2022-04-01T18:36:39.146Z',
        updatedAt: '2022-04-01T18:36:39.146Z',
        hasTags: [],
        locatedOn: {
          city: 'Jakarta',
          stateProvince: 'DKI Jakarta',
          country: 'Indonesia',
          postalCode: '40136',
        },
        hasImage: {
          url: './foto.png',
        },
      },
    ],
  })
  async GetCommunities(): Promise<Result> {
    const communities = await this.CommunityUC.GetCommunities();
    if (!communities) {
      return {
        error: {
          code: 500,
          details: 'Failed to retrieve communities',
        },
      };
    }
    const results: Community[] = [];
    await Promise.all(communities.map(async (community) => {
      const result = await this.CommunityUC.FetchRelations(community, ['hasTags', 'locatedOn', 'hasImage', 'hasBanner']);
      if (!result) {
        return {
          error: {
            code: 500,
            details: 'Could not get community detail, ask administrator',
          },
        };
      }
      results.push(result);
      return true;
    }));
    return {
      result: results,
    };
  }

  /**
   * Update a communitywith the corresponding ID
   * @param CID The community's ID
   */
  @Put('/:CID')
  @Security('accessToken')
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Failed to update community',
  })
  @Response<errorMsg>(403, 'Forbidden', {
    message: 'You are not admin of this community',
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Community not found',
  })
  @Example<defaultResp>({
    data: {
      name: 'communitree',
    },
  })
  async Update(
    @Request() req: UserRequest,
    @Path() CID: number,
    @Body() icommunity: ICommunity,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const community = await this.CommunityUC.GetByID(CID, trx);
      if (!community) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      const isAdmin = await this.CommunityMemberUC.IsAdmin(community.id, req.user.id, trx);
      if (!isAdmin) {
        await trx.rollback();
        return {
          error: {
            code: 403,
            details: 'You are not an admin of this community',
          },
        };
      }
      const success = await this.CommunityUC.Update(community.id, icommunity, trx);
      if (!success) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      await trx.commit();
      return {
        result: icommunity.name,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async JoinCommunity(
    @Body() req: UserRequest,
    @Path() CID: number,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const community = await this.CommunityUC.GetByID(CID, trx);
      if (!community) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      const isMember = await this.CommunityMemberUC.IsMember(community.id, req.user.id, trx);
      if (isMember) {
        await trx.rollback();
        return {
          error: {
            code: 403,
            details: 'You are already a member of this community',
          },
        };
      }
      const success = await this.CommunityMemberUC.JoinCommunity(
        community.id,
        req.user.id,
        false,
        trx,
      );
      if (!success) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      await trx.commit();
      return {
        result: community.name,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async LeaveCommunity(
    @Request() req: UserRequest,
    @Path() CID: number,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const community = await this.CommunityUC.GetByID(CID, trx);
      if (!community) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      const isMember = await this.CommunityMemberUC.IsMember(community.id, req.user.id, trx);
      if (!isMember) {
        await trx.rollback();
        return {
          error: {
            code: 403,
            details: 'You are not a member of this community',
          },
        };
      }
      const success = await this.CommunityMemberUC.LeaveCommunity(community.id, req.user.id, trx);
      if (!success) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      await trx.commit();
      return {
        result: community.name,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Set a user as admin of a community
   * User who grants admin rights must be an admin of the community
   * The user who is granted admin rights must be a member of the community
   * @param CID The community's ID
   */
  // @Post('/:CID/admin/')
  async SetAdmin(
    @Request() req: UserRequest,
    @Path() CID: number,
    @Body() adminIds: IAdminIds,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const community = await this.CommunityUC.GetByID(CID, trx);
      if (!community) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      const setterMembershipStatus = await this.CommunityMemberUC
        .GetMembershipStatus(community.id, req.user.id, trx);
      if (setterMembershipStatus !== 'admin') {
        await trx.rollback();
        return {
          error: {
            code: 403,
            details: 'You are not an admin of this community',
          },
        };
      }

      adminIds.userIds.forEach(async (adminId) => {
        const member = await this.CommunityMemberUC.GetMembershipStatus(community.id, adminId, trx);
        if (member === undefined) {
          await trx.rollback();
          return {
            error: {
              code: 403,
              details: 'User is not a member of this community',
            },
          };
        }
        if (member === 'admin') {
          await trx.rollback();
          return {
            error: {
              code: 403,
              details: 'User is already an admin of this community',
            },
          };
        }
        const success = await this.CommunityMemberUC.SetAdmin(community.id, req.user.id, trx);
        if (!success) {
          await trx.rollback();
          return {
            error: {
              code: 404,
              details: 'Community not found',
            },
          };
        }
        return true;
      });

      await trx.commit();
      return {
        result: community.name,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Remove a user as admin of a community
   * User who removes admin rights must be an admin of the community
   * The user who is removed admin rights must be an admin of the community
   * @param CID The community's ID
   */
  // @Post('/:CID/admin/')
  async UnsetAdmin(
    @Request() req: UserRequest,
    @Path() CID: number,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const community = await this.CommunityUC.GetByID(CID, trx);
      if (!community) {
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      const membershipStatus = await this.CommunityMemberUC
        .GetMembershipStatus(community.id, req.user.id, trx);
      if (membershipStatus === undefined) {
        return {
          error: {
            code: 403,
            details: 'You are not a member of this community',
          },
        };
      }
      if (membershipStatus === 'member') {
        return {
          error: {
            code: 403,
            details: 'You are not an admin of this community',
          },
        };
      }
      const success = await this.CommunityMemberUC.UnsetAdmin(community.id, req.user.id, trx);
      if (!success) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      await trx.commit();
      return {
        result: community.name,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Get user's membership status in a community
   * @param CID id of the community
   */
  @Get('/:CID/members/status')
  @Security('accessToken')
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Failed to get community',
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Community not found',
  })
  @Response<errorMsg>(401, 'Unauthorized', {
    message: 'User not authorized',
  })
  @Example<defaultResp>({
    data: {
      status: 'member',
    },
  })
  async GetMembershipStatus(
    @Request() req: UserRequest,
    @Path() CID: number,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const community = await this.CommunityUC.GetByID(CID, trx);
      if (!community) {
        await trx.rollback();
        return {
          error: {
            code: 404,
            details: 'Community not found',
          },
        };
      }
      const membershipStatus = await this.CommunityMemberUC
        .GetMembershipStatus(community.id, req.user.id, trx);
      await trx.commit();
      return {
        result: membershipStatus ?? 'not a member',
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
