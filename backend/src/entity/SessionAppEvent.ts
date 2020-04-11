import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Session} from "./Session";

@Entity()
export class SessionAppEvent extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column()
    windowName: string;

    @Column()
    windowClass: string;

    @Column()
    windowPid: number;

    @ManyToOne(type => Session,
            session => session.sessionAppEvents,
        { onDelete: "CASCADE" })
    session: Session;
}
