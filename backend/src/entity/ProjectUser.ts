import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {Project} from './Project';
import {User} from './User';
import { Session } from './Session';

export enum ProjectUserRole {
  ADMIN = 'admin',
  EMPLOYER = 'employer',
  EMPLOYEE = 'employee',
}

export enum ProjectUserStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class ProjectUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @ManyToOne(type => Project,
          project => project.users,
      { onDelete: "CASCADE", nullable: false })
  project: Project;

  @ManyToOne(type => User,
          user => user.projects,
      { onDelete: "CASCADE", nullable: false })
  user: User;

  @OneToMany(type => Session,
      session => session.projectUser,
    { onDelete: "SET NULL" })
  sessions: Session[];

  @Column()
  role: ProjectUserRole;

  @Column()
  status: ProjectUserStatus;
}
