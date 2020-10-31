import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

import { nanoid } from "nanoid";

export enum MailRequestType {
  PASSWORD_RESET = "password_reset",
  ACCOUNT_CONFIRMATION = "account_confirmation",
  PROJECT_INVITE = "project_invite",
}

export interface ProjectInvitationPayload {
  inviterId: number; // the one that sends the invitation
  inviteeId: number; // the one that receives the invitation
  projectId: number;
}

export interface AccountConfirmationPayload {
}

@Entity()
export class MailToken extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  emailAddress: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @Column()
  expiresIn: number; // seconds

  @Column()
  type: MailRequestType;

  @Column({ type: "jsonb", nullable: true })
  payload: ProjectInvitationPayload | AccountConfirmationPayload | object;

  @BeforeInsert()
  genNanoId() {
    this.id = nanoid();
  }
}
