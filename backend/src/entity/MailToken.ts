import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

export enum MailRequestType {
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_CONFIRMATION = 'account_confirmation',
  PROJECT_INVITE = 'project_invite',
}

export interface ProjectInvitationPayload {
  inviterId: number; // the one that sends the invitation
  inviteeId: number; // the one that receives the invitation
  projectId: number;
}

@Entity()
export class MailToken extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  emailAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  expiresIn: number; // minutes

  @Column()
  type: MailRequestType;

  @Column({ type: 'jsonb', nullable: true })
  payload: ProjectInvitationPayload | object;
}
