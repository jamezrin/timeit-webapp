import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserStatusToUser1586707789315 implements MigrationInterface {
    name = 'AddUserStatusToUser1586707789315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "status" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`, undefined);
    }

}
