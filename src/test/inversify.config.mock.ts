import { Container } from 'inversify';
import { UserEntities } from '../entities/User.mock';
import { IUserEntities } from '../entities/IUser';
import { IUserUC } from '../usecase/IUser';
import { UserUC } from '../usecase/User';
import { UserController } from '../controller/User';
import { IUserController } from '../controller/IUser';
import { IUserTopicEntities } from '../entities/IUserTopic';
import { UserTopicEntities } from '../entities/UserTopic.mock';
import { IUserTopicUC } from '../usecase/IUserTopic';
import { UserTopicUC } from '../usecase/UserTopic';
import TYPES from '../types';

const container = new Container();
container.bind<IUserEntities>(TYPES.IUserEntities).to(UserEntities).inSingletonScope();
container.bind<IUserUC>(TYPES.IUserUC).to(UserUC).inSingletonScope();
container.bind<IUserController>(TYPES.IUserController).to(UserController).inSingletonScope();

container.bind<IUserTopicEntities>(
  TYPES.IUserTopicEntities,
).to(UserTopicEntities).inSingletonScope();
container.bind<IUserTopicUC>(TYPES.IUserTopicUC).to(UserTopicUC).inSingletonScope();

export default container;
