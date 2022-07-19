/* eslint-disable class-methods-use-this */
import { injectable } from 'inversify';
import { TransactionOrKnex } from 'objection';
import 'reflect-metadata';
import CommunityMember from '../models/dao/CommunityMember';
import { ICommunityMemberEntities } from './ICommunityMember';

@injectable()
export class CommunityMemberEntities implements ICommunityMemberEntities {
  async SetAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await CommunityMember.query(trx).patch({ isAdmin: true }).where('community_id', communityId).where('user_id', userId);
    return success !== 0;
  }

  async UnsetAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean> {
    const success = await CommunityMember.query(trx).patch({ isAdmin: false }).where('community_id', communityId).where('user_id', userId);
    return success !== 0;
  }

  async JoinCommunity(
    communityId: number,
    userId: number,
    isAdmin: boolean,
    trx?: TransactionOrKnex,
  ): Promise<number> {
    const { id } = await CommunityMember.query(trx).insert({ communityId, userId, isAdmin }).returning('id');
    return id;
  }

  async LeaveCommunity(communityId: number, UID: number, trx?: TransactionOrKnex): Promise<number> {
    const success = await CommunityMember.query(trx).delete().findOne({ community_id: communityId, user_id: UID }).returning(['user_id']);
    return success.userId;
  }

  async GetMembersId(communityId: number, trx?: TransactionOrKnex): Promise<number[]> {
    const members = await CommunityMember.query(trx).where('community_id', communityId);
    const membersId = members.map((member) => member.userId);
    return membersId;
  }

  async GetMembershipStatus(
    communityId: number,
    userId: number,
    trx?: TransactionOrKnex,
  ): Promise<string|undefined> {
    const member = await CommunityMember
      .query(trx).findOne({ community_id: communityId, user_id: userId });
    if (member) return member.isAdmin ? 'admin' : 'member';
    return 'not a member';
  }
}
