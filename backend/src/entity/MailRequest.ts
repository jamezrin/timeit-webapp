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

export enum MailRequestType {
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_CONFIRMATION = 'account_confirmation',
}

@Entity()
export class MailRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  expiresIn: number;

  @Column()
  type: MailRequestType; // minutes

  @ManyToOne((type) => User, (user) => user.mailRequests, { eager: true })
  user: User;
}
