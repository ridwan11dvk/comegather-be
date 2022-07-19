import { TransactionOrKnex } from 'objection';

export interface ICommunityMemberUC{
  JoinCommunity(
    communityId: number,
    userId: number,
    isAdmin: boolean,
    trx?: TransactionOrKnex,
  ): Promise<number>,
  LeaveCommunity(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<number>,

  IsMember(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean>,
  IsAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean>,

  SetAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean>,
  UnsetAdmin(communityId: number, userId: number, trx?: TransactionOrKnex): Promise<boolean>,

  GetMembershipStatus(
    communityId: number,
    userId: number,
    trx?: TransactionOrKnex,
  ): Promise<string|undefined>

  GetMembersId(communityId: number, trx?: TransactionOrKnex): Promise<number[]>,
}
