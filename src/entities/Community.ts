/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import Community from '../models/dao/Community';
import { ICommunityEntities } from './ICommunity';

@injectable()
export class CommunityEntities implements ICommunityEntities {
  async Create(community: Community, trx?: TransactionOrKnex): Promise<number> {
    const { id } = await Community.query(trx).insert(community).returning('id');
    return id;
  }

  async GetByID(id: number, trx?: TransactionOrKnex): Promise<Community> {
    const community = await Community.query(trx).findById(id);
    return community;
  }

  async GetCommunities(trx?: TransactionOrKnex): Promise<Community[]> {
    return await Community.query(trx).orderBy('id', 'asc');
  }

  async Update(ID: number, community: Community, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await Community.query(trx).update(community).where('id', ID);
    return success !== 0;
  }

  async FetchRelations(community: Community, graph: string, modifiers?: any): Promise<Community> {
    const result = community.$fetchGraph(graph);
    if (modifiers) {
      return result.modifiers(modifiers);
    }
    return result;
  }
}
