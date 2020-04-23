import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

export enum UserTokenStatus {
  ACTIVE = 'active',
  INACTIVE_OTHER = 'inactive_other',
  INACTIVE_EXPIRED = 'inactive_expired',
  INACTIVE_BLOCKED = 'inactive_blocked',
}

@Entity()
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  status: UserTokenStatus;

  @ManyToOne((type) => User, (user) => user.tokens, { eager: true })
  user: User;
}
