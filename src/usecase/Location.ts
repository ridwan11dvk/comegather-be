import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { ILocation, toDAO } from '../models/dto/Location';
import { ILocationEntities } from '../entities/ILocation';
import TYPES from '../types';
import { ILocationUC } from './ILocation';
import Location from '../models/dao/Location';

@injectable()
export class LocationUC implements ILocationUC {
  private LocationEntities: ILocationEntities;

  constructor(@inject(TYPES.ILocationEntities) LocationEntities: ILocationEntities) {
    this.LocationEntities = LocationEntities;
  }

  async Create(location: ILocation, trx?: TransactionOrKnex): Promise<number> {
    return this.LocationEntities.Create(toDAO(location), trx);
  }

  async GetLocations(): Promise<Location[]> {
    return this.LocationEntities.GetLocations();
  }
}
