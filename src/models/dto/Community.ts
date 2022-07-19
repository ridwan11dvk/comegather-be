import Community from '../dao/Community';

export interface ICommunity {
  name: string;
  description?: string;
  locationId?: number;
  imageId?: number;
  bannerImageId?: number;
  tagIds?: number[];
}

export const isICommunity = (input: any): input is ICommunity => {
  try {
    if (typeof input.name !== 'string') return false;
    if (input.description && typeof input.description !== 'string') return false;
    if (input.locationId && typeof input.locationId !== 'number') return false;
    if (input.imageId && typeof input.imageId !== 'number') return false;
    if (input.bannerImageId && typeof input.bannerImageId !== 'number') return false;
    if (input.tagIds) {
      if (!Array.isArray(input.tagIds)) return false;
      const objs = Object.values(input.tagIds);
      return objs.every((e) => typeof e === 'number');
    }
    return true;
  } catch (e) {
    return false;
  }
};

export interface IAdminIds {
  userIds: number[];
}

export const isIAdminIds = (input: any): input is IAdminIds => {
  try {
    if (!Array.isArray(input.userIds)) return false;
    const objs = Object.values(input.userIds);
    return objs.every((e) => typeof e === 'number');
  } catch (e) {
    return false;
  }
};

export const toDAO = (community: ICommunity) => Community
  .fromJson(community, { skipValidation: false });
