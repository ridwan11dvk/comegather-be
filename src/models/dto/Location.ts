import Location from '../dao/Location';

export interface ILocation{
  city: string,
  stateProvince: string,
  country: string,
  postalCode: string,
  // TODO: add more attributes
}

export const isILocation = (input: any): input is ILocation => {
  try {
    if (typeof input.city !== 'string') return false;
    if (typeof input.stateProvince !== 'string') return false;
    if (typeof input.country !== 'string') return false;
    if (typeof input.postalCode !== 'string') return false;
    // TODO: add more attributes
    return true;
  } catch (err) {
    return false;
  }
};

export const toDAO = (loc: ILocation) => Location.fromJson(loc, { skipValidation: false });
