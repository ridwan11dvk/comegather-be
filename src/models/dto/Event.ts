import { isValidTime } from '../../utils/validator';
import Event from '../dao/Event';

export interface IEvent{
  title: string,
  description?: string,
  startedAt: string,
  endedAt?: string,
  communityId?: number,
  isPublic: boolean,
  imageId?: number,
  type: string,
  site: string,
  capacity: number,
  additionalInfo?: string,
}

const availableTypeEvent = ['onsite', 'online'];

export const isIEvent = (input: any): input is IEvent => {
  try {
    if (typeof input.title !== 'string') return false;
    if (input.description && typeof input.description !== 'string') return false;
    if (!isValidTime(input.startedAt)) return false;
    if (input.endedAt && !isValidTime(input.endedAt)) return false;
    if (input.communityId && typeof input.communityId !== 'number') return false;
    if (typeof input.isPublic !== 'boolean') return false;
    if (input.imageId && typeof input.imageId !== 'number') return false;
    if (typeof input.type !== 'string' || availableTypeEvent.indexOf(input.type) === -1) return false;
    if (typeof input.site !== 'string') return false;
    if (typeof input.capacity !== 'number' || input.capacity < 1) return false;
    if (input.additionalInfo && typeof input.additionalInfo !== 'string') return false;
    return true;
  } catch (e) {
    return false;
  }
};

export const toDao = (event: IEvent) => Event.fromJson(event, { skipValidation: false });
