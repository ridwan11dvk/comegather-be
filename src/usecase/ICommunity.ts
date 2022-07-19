import { TransactionOrKnex } from 'objection';
import Community from '../models/dao/Community';
import { ICommunity } from '../models/dto/Community';

export interface ICommunityUC{
  Create(community: ICommunity, trx?: TransactionOrKnex): Promise<number>,
  Update(ID: number, community: ICommunity, trx?: TransactionOrKnex): Promise<boolean>,

  GetCommunities(): Promise<Community[]>,
  GetByID(id: number, trx?: TransactionOrKnex): Promise<Community>,

  FetchRelations(
    community: Community,
    graph: string[],
    modifiers?: any,
  ): Promise<Community|null>,
}
