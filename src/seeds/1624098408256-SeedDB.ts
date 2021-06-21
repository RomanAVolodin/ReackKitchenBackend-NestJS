import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDB1624098408256 implements MigrationInterface {
  name = 'SeedDB1624098408256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffie'), ('nestjs')`,
    );

  }

  down(queryRunner: QueryRunner): Promise<any> {
    return Promise.resolve(undefined);
  }

}
