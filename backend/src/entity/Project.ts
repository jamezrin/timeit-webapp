import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Session} from "./Session";
import {ProjectUser} from "./ProjectUser";

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
}
