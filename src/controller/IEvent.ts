import { IEvent } from '../models/dto/Event';
import { Result, UserRequest } from '../types';

export interface IEventController{
  Update(req: UserRequest, EID: number, ievent: IEvent): Promise<Result>,

  Delete(req: UserRequest, EID: number) : Promise<Result>,

  GetParticipants(EID: number): Promise<Result>,

  GetAll(): Promise<Result>,

  GetByID(EID: number): Promise<Result>,

  Join(req: UserRequest, EID: number): Promise<Result>,

  Leave(req: UserRequest, EID: number): Promise<Result>,
}
