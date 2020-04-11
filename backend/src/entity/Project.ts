import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Session} from "./Session";
import {ProjectUser} from "./ProjectUser";
import {type} from "os";

@Entity()
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column()
    name: string;

    @OneToMany(type => ProjectUser,
            projectUser => projectUser.project)
    users: ProjectUser[];

    @OneToMany(type => Session,
            session => session.project)
    sessions: Session[];
}
