import {BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "@app/user/user.entity";

@Entity({name: 'articles'})
export class ArticleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column({default: ''})
    description: string;

    @Column({default: ''})
    body: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @Column('simple-array')
    tagList: string[];

    @Column({default: 0})
    favoritesCount: number;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }

    @ManyToOne(() => UserEntity, author => author.articles, {onDelete: "CASCADE", eager: true})
    author: UserEntity
}