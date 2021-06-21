import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFavoritesToUser1624284722274 implements MigrationInterface {
    name = 'AddFavoritesToUser1624284722274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`CREATE TABLE "users_favorites_articles" ("usersId" uuid NOT NULL, "articlesId" uuid NOT NULL, CONSTRAINT "PK_aebb5070a5fa58957adae6d78af" PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3bc5ca3e98f5f3858dbf626ad" ON "users_favorites_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_61dc60abcf0035e5ce2aea013b" ON "users_favorites_articles" ("articlesId") `);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_b3bc5ca3e98f5f3858dbf626ad6" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_61dc60abcf0035e5ce2aea013bc" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_61dc60abcf0035e5ce2aea013bc"`);
        await queryRunner.query(`ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_b3bc5ca3e98f5f3858dbf626ad6"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`DROP INDEX "IDX_61dc60abcf0035e5ce2aea013b"`);
        await queryRunner.query(`DROP INDEX "IDX_b3bc5ca3e98f5f3858dbf626ad"`);
        await queryRunner.query(`DROP TABLE "users_favorites_articles"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
