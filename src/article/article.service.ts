import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserEntity} from "@app/user/user.entity";
import {CreateArticleDto} from "@app/article/dto/create-article.dto";
import {ArticleEntity} from "@app/article/article.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, getRepository, Repository} from "typeorm";
import {ArticleResponseInterface} from "@app/article/types/articleResponse.interface";
import slugify from "slugify";
import {ArticlesResponseInterface} from "@app/article/types/articlesResponse.interface";
import {FollowEntity} from "@app/profile/follow.entity";


@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>
    ) {}

    async findAll(currentUserId: string, query: any): Promise<ArticlesResponseInterface> {
        const queryBuilder = getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author');

        queryBuilder.orderBy('articles.createdAt', 'DESC');
        const articlesCount = await queryBuilder.getCount();

        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', {tag: `%${query.tag}%`});
        }

        if (query.favorited) {
            const author = await this.userRepository.findOne(
                {username: query.favorited},
                {relations: ['favorites']}
            );
            const ids = author.favorites.map( art => art.id);
            if (ids.length > 0) {
                queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
            } else {
                queryBuilder.andWhere('1=0');
            }
        }

        if (query.author) {
            const author = await this.userRepository.findOne({username: query.author});
            queryBuilder.andWhere('articles.authorId = :id', {id: author.id})
        }

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        let favoriteIds: string[] = [];

        if (currentUserId){
            const currentUser = await this.userRepository.findOne(currentUserId,
                {relations: ['favorites']});
            favoriteIds = currentUser.favorites.map(favorite => favorite.id);
        }

        const articles = await queryBuilder.getMany();
        const articlesWithFavorites = articles.map( article => {
            const favorited = favoriteIds.includes(article.id);
            return {...article, favorited};
        });
        return {
            articles: articlesWithFavorites,
            articlesCount
        }
    }

    async create(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const article = new ArticleEntity();
        Object.assign(article, createArticleDto);
        if (!article.tagList) {
            article.tagList = [];
        }
        article.author = currentUser;
        article.slug = ArticleService.getSlug(createArticleDto.title);
        return await this.articleRepository.save(article);
    }

    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return {
            article
        }
    }

    private static getSlug(title: string): string {
        return slugify(title, {lower: true}) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }

    async getBySlug(slug: string): Promise<ArticleEntity> {
        return await this.articleRepository.findOne({where: {slug}}, );
    }

    async deleteArticle(slug: string, currentUserId: string): Promise<DeleteResult> {
        const article = await this.getBySlug(slug);
        if (!article) {
            throw new HttpException('Article doesnt exist', HttpStatus.NOT_FOUND);
        }
        if (article.author.id !== currentUserId) {
            throw new HttpException('Your are not an author', HttpStatus.FORBIDDEN);
        }
        return await this.articleRepository.delete({ slug })
    }

    async updateArticle(slug: string, updateArticleDto: CreateArticleDto, currentUserId: string) {
        const article = await this.getBySlug(slug);
        if (!article) {
            throw new HttpException('Article doesnt exist', HttpStatus.NOT_FOUND);
        }
        if (article.author.id !== currentUserId) {
            throw new HttpException('Your are not an author', HttpStatus.FORBIDDEN);
        }
        Object.assign(article, updateArticleDto);
        return await this.articleRepository.save(article);
    }

    async addArticleToFavorites(slug: string, currentUserId: string): Promise<ArticleEntity> {
        const article = await this.getBySlug(slug);
        const user = await this.userRepository.findOne(currentUserId, {relations: ['favorites']});
        const isNotFavorited = user.favorites.findIndex(a => a.id === article.id) === -1;
        if (isNotFavorited) {
            user.favorites.push(article);
            article.favoritesCount++;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }
        return article;
    }

    async deleteArticleFromFavorites(slug: string, currentUserId: string): Promise<ArticleEntity> {
        const article = await this.getBySlug(slug);
        const user = await this.userRepository.findOne(currentUserId, {relations: ['favorites']});
        const articleIndex = user.favorites.findIndex(a => a.id === article.id);
        if (articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1);
            article.favoritesCount--;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }
        return article;
    }

    async getFeed(currentUserId: string, query: any): Promise<ArticlesResponseInterface> {
        const follows = await this.followRepository.find({
            followerId: currentUserId
        });
        if (follows.length === 0) {
            return { articles: [], articlesCount: 0 }
        }
        const followingUserIds = follows.map( follow => follow.followingId);
        const queryBuilder = getRepository(ArticleEntity).createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
            .where('articles.authorId IN (:...ids)', { ids: followingUserIds });
        queryBuilder.orderBy('articles.createdAt', 'DESC');
        const articlesCount = await queryBuilder.getCount();

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        const articles = await queryBuilder.getMany();
        return {
            articles,
            articlesCount
        }
    }
}
