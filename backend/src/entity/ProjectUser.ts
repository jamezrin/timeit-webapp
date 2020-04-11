import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Project} from './Project';
import {User} from './User';

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
      { onDelete: "CASCADE" })
  project: Project;

  @ManyToOne(type => User,
          user => user.projects,
      { onDelete: "CASCADE" })
  user: User;

  @Column()
  role: ProjectUserRole;

  @Column()
  status: ProjectUserStatus;
}
