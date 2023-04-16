import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './Entity/place.entity';
import { PlaceInfo } from './Entity/placeInfo.entity';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceInfoService } from './placeInfo.service';
import { PlaceMiddleware } from './middlewares/place.mid';
import { JwtModule } from '@nestjs/jwt';
import { SearchCountModule } from '../search_count/search_count.module';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Place, PlaceInfo]),
    SearchCountModule,
  ],
  exports: [PlaceService, PlaceInfoService],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceInfoService, PlaceMiddleware],
})
export class PlaceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PlaceMiddleware)
      .forRoutes({ path: '/place', method: RequestMethod.POST });
  }
}
