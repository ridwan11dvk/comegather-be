import { TransactionOrKnex } from 'objection';
import Location from '../models/dao/Location';
import { ILocation } from '../models/dto/Location';

export interface ILocationUC{
  Create(location: ILocation, trx?: TransactionOrKnex): Promise<number>,
  GetLocations(): Promise<Location[]>,
}
