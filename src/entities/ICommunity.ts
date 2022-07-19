import { TransactionOrKnex } from 'objection';
import Community from '../models/dao/Community';

export interface ICommunityEntities{
  Create(community: Community, trx?: TransactionOrKnex): Promise<number>,

  GetByID(ID: number, trx?: TransactionOrKnex): Promise<Community>,

  GetCommunities(): Promise<Community[]>,

  Update(ID: number, community: Community, trx?: TransactionOrKnex): Promise<boolean>,

  FetchRelations(community: Community, graph: string, modifiers?: any): Promise<Community>,
}
