import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ActivityUpdate {

    @PrimaryGeneratedColumn()
    id: number;

}
