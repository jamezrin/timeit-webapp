import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SessionNote } from './SessionNote';
import { ProjectMember } from './ProjectMember';
import { SessionAppEvent } from './SessionAppEvent';

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt: Date;

  @ManyToOne((type) => ProjectMember, (project) => project.sessions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  projectMember: ProjectMember;

  @OneToMany((type) => SessionAppEvent, (activityUpdate) => activityUpdate.session)
  sessionAppEvents: SessionAppEvent[];

  @OneToMany((type) => SessionNote, (activityNote) => activityNote.session)
  sessionNotes: SessionNote[];
}
