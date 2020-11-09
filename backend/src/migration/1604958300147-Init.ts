import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1604958300147 implements MigrationInterface {
    name = 'Init1604958300147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session_note" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "noteText" text NOT NULL, "sessionId" integer NOT NULL, CONSTRAINT "PK_6bd25def23415066440a308a308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session_app_event" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "windowName" character varying NOT NULL, "windowClass" character varying NOT NULL, "windowPid" integer NOT NULL, "sessionId" integer NOT NULL, CONSTRAINT "PK_6fb40d78b51ef86f529ec3c318d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "endedAt" TIMESTAMP WITH TIME ZONE, "projectMemberId" integer NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_member" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "role" character varying NOT NULL, "status" character varying NOT NULL, "projectId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_64dba8e9dcf96ce383cfd19d6fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'disabled', "type" character varying NOT NULL DEFAULT 'regular', "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "emailAddress" character varying NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_eea9ba2f6e1bb8cb89c4e672f6" ON "user" ("emailAddress") `);
        await queryRunner.query(`CREATE TABLE "auth_token" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mail_token" ("id" character varying NOT NULL, "emailAddress" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiresIn" integer NOT NULL, "type" character varying NOT NULL, "payload" jsonb, CONSTRAINT "PK_7cae2b2aa982bac9ca71402b8c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_note" ADD CONSTRAINT "FK_d3d7f6f9a4a5e8eecaa07598b18" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session_app_event" ADD CONSTRAINT "FK_b031fb762ad5f0ca21eefcdebd6" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_b566510dbc751d8f0c84b617a2e" FOREIGN KEY ("projectMemberId") REFERENCES "project_member"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_token" ADD CONSTRAINT "FK_5a326267f11b44c0d62526bc718" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_token" DROP CONSTRAINT "FK_5a326267f11b44c0d62526bc718"`);
        await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_e7520163dafa7c1104fd672caad"`);
        await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_b566510dbc751d8f0c84b617a2e"`);
        await queryRunner.query(`ALTER TABLE "session_app_event" DROP CONSTRAINT "FK_b031fb762ad5f0ca21eefcdebd6"`);
        await queryRunner.query(`ALTER TABLE "session_note" DROP CONSTRAINT "FK_d3d7f6f9a4a5e8eecaa07598b18"`);
        await queryRunner.query(`DROP TABLE "mail_token"`);
        await queryRunner.query(`DROP TABLE "auth_token"`);
        await queryRunner.query(`DROP INDEX "IDX_eea9ba2f6e1bb8cb89c4e672f6"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "session_app_event"`);
        await queryRunner.query(`DROP TABLE "session_note"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
