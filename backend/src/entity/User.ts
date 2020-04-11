import {BaseEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {ProjectUser} from "./ProjectUser";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index({ unique: true })
  emailAddress: string;

  @Column()
  passwordHash: string;

  @Column()
  dateOfBirth: Date;

  @OneToMany(type => ProjectUser,
          projectUser => projectUser.user)
  projects: ProjectUser[];
}
