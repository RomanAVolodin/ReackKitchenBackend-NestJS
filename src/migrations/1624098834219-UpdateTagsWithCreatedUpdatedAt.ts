import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTagsWithCreatedUpdatedAt1624098834219
  implements MigrationInterface
{
  name = 'UpdateTagsWithCreatedUpdatedAt1624098834219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tags" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "created_at"`);
  }
}
