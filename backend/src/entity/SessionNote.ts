import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Session } from './Session';

@Entity()
export class SessionNote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column('text')
  noteText: string;

  @ManyToOne((type) => Session, (session) => session.sessionNotes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  session: Session;
}
