import { TransactionOrKnex } from 'objection';

export interface ICommunityMemberEntities{
  SetAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean>;
  UnsetAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean>;

  JoinCommunity(
    communityId: number,
    userId: number,
    isAdmin: boolean,
    trx?: TransactionOrKnex,
  ): Promise<number>;
  LeaveCommunity(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<number>;

  GetMembersId(communityId: number, trx?: TransactionOrKnex): Promise<number[]>;
  GetMembershipStatus(
    communityId: number,
    userId: number,
    trx?: TransactionOrKnex
  ): Promise<string|undefined>;
}
