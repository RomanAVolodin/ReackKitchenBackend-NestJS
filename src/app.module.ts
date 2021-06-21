import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {AppController} from '@app/app.controller';
import {AppService} from '@app/app.service';
import {TagModule} from '@app/tag/tag.module';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './user/user.module';
import config from '@app/ormconfig';
import {AuthMiddleware} from "@app/user/middlewares/auth.middleware";
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(config),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(({
      path: '*',
      method: RequestMethod.ALL
    }))
  }
}
