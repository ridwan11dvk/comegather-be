import { ITopic } from '../models/dto/Topic';
import { Result } from '../types';

export interface ITopicController{
  Create(itopic: ITopic): Promise<Result>,
  GetTopics(): Promise<Result>,
}
