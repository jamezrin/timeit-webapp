import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEndDateToSession1586695391822 implements MigrationInterface {
    name = 'AddEndDateToSession1586695391822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ADD "endedAt" TIMESTAMP WITH TIME ZONE NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "endedAt"`, undefined);
    }

}
