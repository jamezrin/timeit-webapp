import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

export enum AuthTokenStatus {
  ACTIVE = 'active',
  INACTIVE_OTHER = 'inactive_other',
  INACTIVE_EXPIRED = 'inactive_expired',
  INACTIVE_BLOCKED = 'inactive_blocked',
}

@Entity()
export class AuthToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  status: AuthTokenStatus;

  @ManyToOne((type) => User, (user) => user.authTokens, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  user: User;
}
