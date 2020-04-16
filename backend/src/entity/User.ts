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
import { MailRequest } from './MailRequest';

export enum UserStatus {
  NOT_CONFIRMED = "not_confirmed",
  ACTIVE = "active",
  DISABLED = "disabled"
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @Column()
  status: UserStatus

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index({ unique: true })
  emailAddress: string;

  @Column()
  passwordHash: string;

  @Column({ type: "date" })
  dateOfBirth: Date;

  @OneToMany(type => ProjectUser,
          projectUser => projectUser.user,
    { eager: true, onDelete: "CASCADE" })
  projects: ProjectUser[];

  @OneToMany(type => UserToken,
      token => token.user,
    { onDelete: "CASCADE" })
  tokens: UserToken[];

  @OneToMany(type => MailRequest,
      mailRequest => mailRequest.user,
    { onDelete: "CASCADE" })
  mailRequests: MailRequest[];
}
