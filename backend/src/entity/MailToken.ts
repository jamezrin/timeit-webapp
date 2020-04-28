import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

export enum MailRequestType {
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_CONFIRMATION = 'account_confirmation',
  PROJECT_INVITE = 'project_invite',
}

@Entity()
export class MailToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  expiresIn: number; // minutes

  @Column()
  type: MailRequestType;

  @ManyToOne((type) => User, (user) => user.mailTokens, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  payload: Object;
}
