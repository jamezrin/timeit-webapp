import {BaseEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ProjectUser} from "./ProjectUser";

export enum UserStatus {
  NOT_CONFIRMED = "not_confirmed",
  ACTIVE = "active",
  DISABLED = "disabled"
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: "timestamptz"})
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

  @Column()
  dateOfBirth: Date;

  @OneToMany(type => ProjectUser,
          projectUser => projectUser.user)
  projects: ProjectUser[];
}
