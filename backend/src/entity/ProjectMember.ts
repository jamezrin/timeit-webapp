import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';
import { Project } from './Project';
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
export class ProjectMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany((type) => Session, (session) => session.projectMember)
  sessions: Session[];

  @ManyToOne((type) => Project, (project) => project.members, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  project: Project;

  @ManyToOne((type) => User, (user) => user.projects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column()
  role: ProjectUserRole;

  @Column()
  status: ProjectUserStatus;
}
