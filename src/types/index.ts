import { Request } from 'express';
import User from '../models/dao/User';

const TYPES = {
  // User
  IUserUC: Symbol('IUserUC'),
  IUserController: Symbol('IUserController'),
  IUserEntities: Symbol('IUserEntities'),

  // User Topic
  IUserTopicUC: Symbol('IUserTopicUC'),
  IUserTopicController: Symbol('IUserTopicController'),
  IUserTopicEntities: Symbol('IUserTopicEntities'),

  // Topic
  ITopicUC: Symbol('ITopicUC'),
  ITopicController: Symbol('ITopicController'),
  ITopicEntities: Symbol('ITopicEntities'),

  // Location
  ILocationUC: Symbol('ILocationUC'),
  ILocationController: Symbol('ILocationController'),
  ILocationEntities: Symbol('ILocationEntities'),

  // File
  IFileUC: Symbol('IFileUC'),
  IFileController: Symbol('IFileController'),
  IFileEntities: Symbol('IFileEntities'),

  // Event
  IEventUC: Symbol('IEventUC'),
  IEventController: Symbol('IEventController'),
  IEventEntities: Symbol('IEventEntities'),

  // EventParticipant
  IEParticipantUC: Symbol('IEParticipantUC'),
  IEParticipantController: Symbol('IEParticipantController'),
  IEParticipantEntities: Symbol('IEParticipantEntities'),

  // Community
  ICommunityUC: Symbol('ICommunityUC'),
  ICommunityController: Symbol('ICommunityController'),
  ICommunityEntities: Symbol('ICommunityEntities'),
  ICommunityTopicUC: Symbol('ICommunityTopicUC'),
  ICommunityTopicEntities: Symbol('ICommunityTopicEntities'),
  ICommunityMemberUC: Symbol('ICommunityMemberUC'),
  ICommunityMemberEntities: Symbol('ICommunityMemberEntities'),
};
export interface UserRequest extends Request {
  user: User
}
interface HTTPError {
  code: number,
  details: string,
  additional_info?: any,
}

export interface Result{
  result?: any,
  error?: HTTPError
}

export interface MockTable<Model>{
  table: Model[]
}

export default TYPES;
