import { Entity, Column, CreateDateColumn } from 'typeorm';
import { Project } from './Project';
import { User } from './User';

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
export class ProjectUser {
  @Column()
  project: Project;

  @Column()
  user: User;

  @Column()
  role: ProjectUserRole;

  @Column()
  status: ProjectUserStatus;

  @CreateDateColumn()
  createdAt: Date;
}
