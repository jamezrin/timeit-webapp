import {
    BaseEntity, Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {SessionAppEvent} from "./SessionAppEvent";
import {Project} from "./Project";
import {SessionNote} from "./SessionNote";
import { ProjectUser } from './ProjectUser';

@Entity()
export class Session extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updatedAt: Date;

    @Column({type: "timestamptz", nullable: true })
    endedAt: Date;

    @ManyToOne(type => ProjectUser,
            project => project.sessions,
        { onDelete: "CASCADE", nullable: false })
    projectUser: ProjectUser;

    @OneToMany(type => SessionAppEvent,
            activityUpdate => activityUpdate.session)
    sessionAppEvents: SessionAppEvent[];

    @OneToMany(type => SessionNote,
        activityNote => activityNote.session)
    sessionNotes: SessionNote[];
}
