import { Container } from 'inversify';
import TYPES from '../types';

import { UserEntities } from '../entities/User';
import { IUserEntities } from '../entities/IUser';
import { IUserUC } from '../usecase/IUser';
import { UserUC } from '../usecase/User';
import { UserController } from '../controller/User';
import { IUserController } from '../controller/IUser';

import { IUserTopicEntities } from '../entities/IUserTopic';
import { UserTopicEntities } from '../entities/UserTopic';
import { IUserTopicUC } from '../usecase/IUserTopic';
import { UserTopicUC } from '../usecase/UserTopic';

import { ITopicEntities } from '../entities/ITopic';
import { TopicEntities } from '../entities/Topic';
import { ITopicUC } from '../usecase/ITopic';
import { TopicUC } from '../usecase/Topic';
import { ITopicController } from '../controller/ITopic';
import { TopicController } from '../controller/Topic';

import { ILocationEntities } from '../entities/ILocation';
import { LocationEntities } from '../entities/Location';
import { ILocationUC } from '../usecase/ILocation';
import { LocationUC } from '../usecase/Location';
import { ILocationController } from '../controller/ILocation';
import { LocationController } from '../controller/Location';

import { IFileEntities } from '../entities/IFile';
import { FileEntities } from '../entities/File';
import { IFileUC } from '../usecase/IFile';
import { FileUC } from '../usecase/File';
import { IFileController } from '../controller/IFile';
import { FileController } from '../controller/File';

import { ICommunityUC } from '../usecase/ICommunity';
import { CommunityUC } from '../usecase/Community';
import { ICommunityEntities } from '../entities/ICommunity';
import { CommunityEntities } from '../entities/Community';
import { ICommunityController } from '../controller/ICommunity';
import { CommunityController } from '../controller/Community';

import { ICommunityTopicUC } from '../usecase/ICommunityTopic';
import { CommunityTopicUC } from '../usecase/CommunityTopic';
import { ICommunityTopicEntities } from '../entities/ICommunityTopic';
import { CommunityTopicEntities } from '../entities/CommunityTopic';

import { ICommunityMemberUC } from '../usecase/ICommunityMember';
import { CommunityMemberUC } from '../usecase/CommunityMember';
import { ICommunityMemberEntities } from '../entities/ICommunityMember';
import { CommunityMemberEntities } from '../entities/CommunityMember';

import { IEventController } from '../controller/IEvent';
import { EventController } from '../controller/Event';
import { IEventUC } from '../usecase/IEvent';
import { EventUC } from '../usecase/Event';
import { IEventEntities } from '../entities/IEvent';
import { EventEntities } from '../entities/Event';

import { IEParticipantEntities } from '../entities/IEParticipant';
import { EventParticipantEntities } from '../entities/EventParticipant';

import { IEParticipantUC } from '../usecase/IEParticipants';
import { EventParticipantUC } from '../usecase/EventParticipant';

const container = new Container();
// User
container.bind<IUserEntities>(TYPES.IUserEntities).to(UserEntities).inSingletonScope();
container.bind<IUserUC>(TYPES.IUserUC).to(UserUC).inSingletonScope();
container.bind<IUserController>(TYPES.IUserController).to(UserController).inSingletonScope();

// User topic
container.bind<IUserTopicEntities>(TYPES.IUserTopicEntities)
  .to(UserTopicEntities).inSingletonScope();
container.bind<IUserTopicUC>(TYPES.IUserTopicUC).to(UserTopicUC).inSingletonScope();

// Topic
container.bind<ITopicEntities>(TYPES.ITopicEntities).to(TopicEntities).inSingletonScope();
container.bind<ITopicUC>(TYPES.ITopicUC).to(TopicUC).inSingletonScope();
container.bind<ITopicController>(TYPES.ITopicController).to(TopicController).inSingletonScope();

// Location
container.bind<ILocationEntities>(TYPES.ILocationEntities).to(LocationEntities).inSingletonScope();
container.bind<ILocationUC>(TYPES.ILocationUC).to(LocationUC).inSingletonScope();
container.bind<ILocationController>(TYPES.ILocationController)
  .to(LocationController).inSingletonScope();

// File
container.bind<IFileEntities>(TYPES.IFileEntities).to(FileEntities).inSingletonScope();
container.bind<IFileUC>(TYPES.IFileUC).to(FileUC).inSingletonScope();
container.bind<IFileController>(TYPES.IFileController).to(FileController).inSingletonScope();

// Community
container.bind<ICommunityEntities>(TYPES.ICommunityEntities)
  .to(CommunityEntities).inSingletonScope();
container.bind<ICommunityUC>(TYPES.ICommunityUC).to(CommunityUC).inSingletonScope();
container.bind<ICommunityController>(TYPES.ICommunityController)
  .to(CommunityController).inSingletonScope();

// Community Topic
container.bind<ICommunityTopicEntities>(TYPES.ICommunityTopicEntities)
  .to(CommunityTopicEntities).inSingletonScope();
container.bind<ICommunityTopicUC>(TYPES.ICommunityTopicUC).to(CommunityTopicUC).inSingletonScope();

// Community Member
container.bind<ICommunityMemberEntities>(TYPES.ICommunityMemberEntities)
  .to(CommunityMemberEntities).inSingletonScope();
container.bind<ICommunityMemberUC>(TYPES.ICommunityMemberUC)
  .to(CommunityMemberUC).inSingletonScope();

container.bind<IEventController>(TYPES.IEventController).to(EventController).inSingletonScope();
container.bind<IEventUC>(TYPES.IEventUC).to(EventUC).inSingletonScope();
container.bind<IEventEntities>(TYPES.IEventEntities).to(EventEntities).inSingletonScope();

container.bind<IEParticipantEntities>(TYPES.IEParticipantEntities)
  .to(EventParticipantEntities).inSingletonScope();
container.bind<IEParticipantUC>(TYPES.IEParticipantUC).to(EventParticipantUC).inSingletonScope();
export default container;
