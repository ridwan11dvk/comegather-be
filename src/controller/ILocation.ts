import { ILocation } from '../models/dto/Location';
import { Result } from '../types';

export interface ILocationController{
  Create(ilocation: ILocation): Promise<Result>,
  GetLocations(): Promise<Result>,
}
