import { inject, injectable } from 'inversify';
import { Model } from 'objection';
import {
  Body, Example, Get, Response, Route, SuccessResponse, Tags, Post
} from 'tsoa';
import { errorMsg } from '../models/dto';
import { ITopic } from '../models/dto/Topic';
import TYPES, { Result } from '../types';
import { ITopicUC } from '../usecase/ITopic';
import { ITopicController } from './ITopic';

@Tags('Topic')
@Route('topics')
@injectable()
export class TopicController implements ITopicController {
  private TopicUC: ITopicUC;

  constructor(@inject(TYPES.ITopicUC) TopicUC: ITopicUC) {
    this.TopicUC = TopicUC;
  }

  /**
   * render
   */
  @Post('/')
  @SuccessResponse(200, 'Ok')
  @Example({
    data: {
      name: 'Topic 1',
    }    
  })
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Server error, cannot create topic',
  })
  async Create(@Body() itopic: ITopic): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      await this.TopicUC.Create(itopic, trx);
      await trx.commit();
      return {
        result: itopic.name,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Get all topics
   */
  @Get('/')
  @SuccessResponse(200, 'Ok')
  @Example({
    data: [
      {
        id: 1,
        name: 'programming',
        description: 'create a program',
        createdAt: '2022-04-08T06:13:51.594Z',
        updatedAt: '2022-04-08T06:13:51.594Z',
        imageId: null,
      },
      {
        id: 2,
        name: 'math',
        description: 'calculate',
        createdAt: '2022-04-08T06:13:51.594Z',
        updatedAt: '2022-04-08T06:13:51.594Z',
        imageId: null,
      },
    ],
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Topic not found',
  })
  async GetTopics(): Promise<Result> {
    const result = await this.TopicUC.GetTopics();
    if (!result) {
      return {
        error: {
          code: 404,
          details: 'Topic not found',
        },
      };
    }
    return {
      result,
    };
  }
}
