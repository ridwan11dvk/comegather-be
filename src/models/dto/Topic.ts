import Topic from '../dao/Topic';

export interface ITopic{
  name: string,
  description?: string,
  imageId?: number,
}

export const isITopic = (input: any): input is ITopic => {
  try {
    if (typeof input.name !== 'string') return false;
    if (input.description && typeof input.description !== 'string') return false;
    if (input.imageId && typeof input.imageId !== 'number') return false;
    // TODO: add more attributes
    return true;
  } catch (err) {
    return false;
  }
};

export const toDAO = (topic: ITopic) => Topic.fromJson(topic, { skipValidation: false });
