import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfig } from 'src/database/typeorm.config';
import { AuthModule } from 'src/auth/auth.module';
import { PlaceModule } from './place/place.module';
import { PlaceReviewModule } from './place_review/place_review.module';
import { WantPlaceModule } from './want_place/want_place.module';
import { ReviewMoodModule } from './review_mood/review_mood.module';
import { LoggerMiddleware } from './utils/logger.middleware';
import { PlaceStatsModule } from './place_stats/place.stats.module';
import { ChartModule } from './chart/chart.module';
import { SearchCountModule } from './search_count/search_count.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev',
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    PlaceModule,
    PlaceReviewModule,
    WantPlaceModule,
    ReviewMoodModule,
    PlaceStatsModule,
    ChartModule,
    SearchCountModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    //winston logger Use Global
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
