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

import { ProjectUser } from './ProjectUser';
import { UserToken } from './UserToken';
import { MailToken } from './MailToken';

export enum UserStatus {
  NOT_CONFIRMED = 'not_confirmed',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  status: UserStatus;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index({ unique: true })
  emailAddress: string;

  @Column()
  passwordHash: string;

  @OneToMany((type) => ProjectUser, (projectUser) => projectUser.user, {
    eager: true,
  })
  projects: ProjectUser[];

  @OneToMany((type) => UserToken, (token) => token.user)
  tokens: UserToken[];

  @OneToMany((type) => MailToken, (mailToken) => mailToken.user)
  mailTokens: MailToken[];
}
