import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameToUser1624115578394 implements MigrationInterface {
  name = 'AddUsernameToUser1624115578394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "bio" TO "username"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "username" TO "bio"`,
    );
  }
}
