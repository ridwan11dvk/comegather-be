import { inject, injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import { ICommunityMemberEntities } from '../entities/ICommunityMember';
import TYPES from '../types';
import { ICommunityMemberUC } from './ICommunityMember';

@injectable()
export class CommunityMemberUC implements ICommunityMemberUC {
  private CommunityMemberEntities: ICommunityMemberEntities;

  constructor(@inject(TYPES.ICommunityMemberEntities)
    CommunityMemberEntities: ICommunityMemberEntities) {
    this.CommunityMemberEntities = CommunityMemberEntities;
  }

  async JoinCommunity(
    communityId: number,
    userId: number,
    isAdmin: boolean,
    trx?: TransactionOrKnex,
  ): Promise<number> {
    return this.CommunityMemberEntities.JoinCommunity(communityId, userId, isAdmin, trx);
  }

  async LeaveCommunity(
    communityId: number,
    userId: number,
    trx?: TransactionOrKnex,
  ): Promise<number> {
    return this.CommunityMemberEntities.LeaveCommunity(communityId, userId, trx);
  }

  async GetMembershipStatus(
    communityId: number,
    userId: number,
    trx?: TransactionOrKnex,
  ): Promise<string|undefined> {
    return this.CommunityMemberEntities.GetMembershipStatus(communityId, userId, trx);
  }

  async IsMember(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean> {
    return await this.GetMembershipStatus(communityId, userId, trx) === 'member';
  }

  async IsAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean> {
    return await this.GetMembershipStatus(communityId, userId, trx) === 'admin';
  }

  async SetAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean> {
    return this.CommunityMemberEntities.SetAdmin(communityId, userId, trx);
  }

  async UnsetAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean> {
    return this.CommunityMemberEntities.UnsetAdmin(communityId, userId, trx);
  }

  async GetMembersId(communityId: number, trx?: TransactionOrKnex): Promise<number[]> {
    return this.CommunityMemberEntities.GetMembersId(communityId, trx);
  }
}
