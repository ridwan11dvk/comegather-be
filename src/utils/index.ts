import { Model } from 'objection';
// import Community from '../models/dao/Community';
// import CommunityMember from '../models/dao/CommunityMember';
// import CommunityTopic from '../models/dao/CommunityTopic';
// import Event from '../models/dao/Event';
// import EventParticipants from '../models/dao/EventParticipant';
// import File from '../models/dao/File';
// import Location from '../models/dao/Location';
// import Topic from '../models/dao/Topic';
// import User from '../models/dao/User';
// import UserTopic from '../models/dao/UserTopic';

export const recursiveRelated = (ctor: typeof Model[], graph: string): boolean => {
  if (!ctor.length) return false;
  const afterPeriod = graph.substring(graph.indexOf('.') + 1);
  const beforePeriod = graph.substring(0, graph.indexOf('.'));
  if (afterPeriod === graph) return graph in ctor[0].relationMappings;
  const firstCtor = ctor.shift();
  return beforePeriod in firstCtor.relationMappings
    && recursiveRelated(ctor, afterPeriod);
};
