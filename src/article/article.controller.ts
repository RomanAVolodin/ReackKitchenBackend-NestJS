import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {ArticleService} from "@app/article/article.service";
import {AuthGuard} from "@app/user/guards/auth.guard";
import {UserEntity} from "@app/user/user.entity";
import {User} from "@app/user/decorators/user.decorator";
import {CreateArticleDto} from "@app/article/dto/create-article.dto";
import {ArticleResponseInterface} from "@app/article/types/articleResponse.interface";
import {ArticlesResponseInterface} from "@app/article/types/articlesResponse.interface";
import {BackendValidationPipe} from "@app/share/pipes/backendValidation.pipe";

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    async findAll(
        @User('id') currentUserId: string,
        @Query() query: any
    ): Promise<ArticlesResponseInterface> {
        return await this.articleService.findAll(currentUserId, query);
    }

    @Get('/feed')
    @UseGuards(AuthGuard)
    async getFeed(@User('id') currentUserId: string, @Query() query: any): Promise<ArticlesResponseInterface> {
        return await this.articleService.getFeed(currentUserId, query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async create(
        @User() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto
    ): Promise<ArticleResponseInterface> {
        const article = await this.articleService.create(currentUser, createArticleDto);
        return this.articleService.buildArticleResponse(article);
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async updateArticle(
        @User('id') currentUserId: string,
        @Param('slug') slug: string,
        @Body('article') updateArticleDto: CreateArticleDto
    ): Promise<ArticleResponseInterface> {
        const article =  await this.articleService.updateArticle(slug, updateArticleDto, currentUserId);
        return this.articleService.buildArticleResponse(article);
    }

    @Get(':slug')
    async articleDetails(@Param('slug') slug: string): Promise<ArticleResponseInterface>  {
        const article = await this.articleService.getBySlug(slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@User('id') currentUserId: string, @Param('slug') slug: string) {
        return await this.articleService.deleteArticle(slug, currentUserId);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleToFavorites(@User('id') currentUserId: string, @Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.addArticleToFavorites(slug, currentUserId);
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async deleteArticleFromFavorites(@User('id') currentUserId: string, @Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.deleteArticleFromFavorites(slug, currentUserId);
        return this.articleService.buildArticleResponse(article);
    }
}
