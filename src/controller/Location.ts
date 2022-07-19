import { inject, injectable } from 'inversify';
import { Model } from 'objection';
import { errorMsg } from '../models/dto';
import { Body, Example, Get, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { ILocation } from '../models/dto/Location';
import TYPES, { Result } from '../types';
import { ILocationUC } from '../usecase/ILocation';
import { ILocationController } from './ILocation';

@Tags("Location")
@Route('locations')
@injectable()
export class LocationController implements ILocationController {
  private LocationUC: ILocationUC;

  constructor(@inject(TYPES.ILocationUC) LocationUC: ILocationUC) {
    this.LocationUC = LocationUC;
  }

  /**
   * Create location 
   */
  // @Post('/')
  @SuccessResponse(200, 'Ok')
  @Example({
    data: {
      postalCode: '99999',
    }    
  })
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Server error, cannot create topic',
  })
  async Create(@Body() ilocation: ILocation): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      await this.LocationUC.Create(ilocation, trx);
      await trx.commit();
      return {
        result: ilocation.postalCode,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Get all locations
   */
  @Get('/')
  @SuccessResponse(200, 'Ok')
  @Example({
    data: [
      {
        id: 1,
        city: "Bandung",
        stateProvince: "Jawa Barat",
        country: "Indonesia",
        postalCode: "40135",
        createdAt: "2022-04-14T08:06:40.294Z",
        updatedAt: "2022-04-14T08:06:40.294Z"
      },
      {
        id: 2,
        city: "Jakarta",
        stateProvince: "DKI Jakarta",
        country: "Indonesia",
        postalCode: "40136",
        createdAt: "2022-04-14T08:06:40.294Z",
        updatedAt: "2022-04-14T08:06:40.294Z"
      },
    ]
  })
  @Response<errorMsg>(404, 'Not Found', {
    message: 'Could not get locations, ask administrator',
  })
  async GetLocations(): Promise<Result> {
    const result = await this.LocationUC.GetLocations();
    if (!result) {
      return {
        error: {
          code: 404,
          details: 'Could not get locations, ask administrator',
        },
      };
    }
    return {
      result,
    };
  }
}
