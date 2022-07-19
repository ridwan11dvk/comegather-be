import { TransactionOrKnex } from 'objection';
import Location from '../models/dao/Location';

export interface ILocationEntities{
  Create(location: Location, trx?: TransactionOrKnex): Promise<number>,
  GetLocations(): Promise<Location[]>,
}
