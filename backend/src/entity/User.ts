import { BaseEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ProjectMember } from "./ProjectMember";
import { AuthToken } from "./AuthToken";

export enum UserStatus {
  NOT_CONFIRMED = "not_confirmed",
  ACTIVE = "active",
  DISABLED = "disabled",
}

export enum UserType {
  REGULAR = "regular",
  ADMIN = "admin",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @Column({ default: UserStatus.DISABLED })
  status: UserStatus;

  @Column({ default: UserType.REGULAR })
  type: UserType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index({ unique: true })
  emailAddress: string;

  @Column()
  passwordHash: string;

  @OneToMany((type) => ProjectMember, (projectUser) => projectUser.user, {
    eager: true
  })
  projects: ProjectMember[];

  @OneToMany((type) => AuthToken, (token) => token.user)
  authTokens: AuthToken[];
}
