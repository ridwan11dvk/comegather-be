import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { ICommunity, toDAO } from '../models/dto/Community';
import { ICommunityEntities } from '../entities/ICommunity';
import { ICommunityMemberEntities } from '../entities/ICommunityMember';
import TYPES from '../types';
import { ICommunityUC } from './ICommunity';
import Community from '../models/dao/Community';

@injectable()
export class CommunityUC implements ICommunityUC {
  private CommunityEntities: ICommunityEntities;

  private CommunityMemberEntities: ICommunityMemberEntities;

  constructor(@inject(TYPES.ICommunityEntities) CommunityEntities: ICommunityEntities) {
    this.CommunityEntities = CommunityEntities;
  }

  async Create(community: ICommunity, trx?: TransactionOrKnex): Promise<number> {
    return this.CommunityEntities.Create(toDAO(community), trx);
  }

  async GetCommunities(): Promise<Community[]> {
    return this.CommunityEntities.GetCommunities();
  }

  async Update(ID: number, community: ICommunity, trx?: TransactionOrKnex): Promise<boolean> {
    return this.CommunityEntities.Update(ID, toDAO(community), trx);
  }

  async GetByID(ID: number, trx?: TransactionOrKnex): Promise<Community> {
    return this.CommunityEntities.GetByID(ID, trx);
  }

  async FetchRelations(
    community: Community,
    graph: string[],
    modifiers?: any,
  ): Promise<Community> {
    return this.CommunityEntities.FetchRelations(community, `[${graph.toString()}]`, modifiers);
  }
}
