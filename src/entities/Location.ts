/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import Location from '../models/dao/Location';
import { ILocationEntities } from './ILocation';

@injectable()
export class LocationEntities implements ILocationEntities {
  async Create(location: Location, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await Location.query(trx).insert(location).returning('id');
    return id;
  }
  
  async GetLocations(): Promise<Location[]> {
    return Location.query().orderBy('id', 'asc');
  }
}
