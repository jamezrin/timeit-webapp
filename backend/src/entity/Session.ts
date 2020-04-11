import {
    BaseEntity,
    Column,
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

@Entity()
export class Session extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updatedAt: Date;

    @ManyToOne(type => Project,
            project => project.sessions,
        { onDelete: "CASCADE" })
    project: Project;

    @OneToMany(type => SessionAppEvent,
            activityUpdate => activityUpdate.session)
    sessionAppEvents: SessionAppEvent[];

    @OneToMany(type => SessionNote,
        activityNote => activityNote.session)
    sessionNotes: SessionNote[];
}
