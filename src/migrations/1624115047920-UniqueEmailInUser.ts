import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueEmailInUser1624115047920 implements MigrationInterface {
  name = 'UniqueEmailInUser1624115047920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
  }
}
