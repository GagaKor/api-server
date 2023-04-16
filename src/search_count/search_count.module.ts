import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchCountService } from './search_count.service';
import { SearchCount } from './Entity/search_count.entity';
import { SearchCountController } from './search_count.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SearchCount])],
  exports: [SearchCountService],
  providers: [SearchCountService],
  controllers: [SearchCountController],
})
export class SearchCountModule {}
