import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index, JoinTable, ManyToMany, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import {ArticleEntity} from "@app/article/article.entity";

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ default: '' })
  username: string;

  @Column({ default: '' })
  image: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => ArticleEntity, article => article.author)
  articles: ArticleEntity[]

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[]

}
