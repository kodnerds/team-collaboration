import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1770158855647 implements MigrationInterface {
  name = 'NewMigration1770158855647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_status_enum" AS ENUM('backlog', 'todo', 'doing', 'in_review', 'approved', 'done')`
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "status" "public"."task_status_enum" NOT NULL DEFAULT 'todo', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, "createdById" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying(150) NOT NULL, "password" character varying NOT NULL, "avatarUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "task_assignees_user" ("taskId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_910c37c13f72414640db814dc60" PRIMARY KEY ("taskId", "userId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6779281224d4075bfd0c18fdc2" ON "task_assignees_user" ("taskId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d3ab8572b56640902c3f40fcaa" ON "task_assignees_user" ("userId") `
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees_user" ADD CONSTRAINT "FK_6779281224d4075bfd0c18fdc2c" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees_user" ADD CONSTRAINT "FK_d3ab8572b56640902c3f40fcaa2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_assignees_user" DROP CONSTRAINT "FK_d3ab8572b56640902c3f40fcaa2"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees_user" DROP CONSTRAINT "FK_6779281224d4075bfd0c18fdc2c"`
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"`);
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_d3ab8572b56640902c3f40fcaa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6779281224d4075bfd0c18fdc2"`);
    await queryRunner.query(`DROP TABLE "task_assignees_user"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    await queryRunner.query(`DROP TABLE "project"`);
  }
}
