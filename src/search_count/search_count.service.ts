import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchCount } from './Entity/search_count.entity';

@Injectable()
export class SearchCountService {
  constructor(
    @InjectRepository(SearchCount)
    private readonly searchCountRepository: Repository<SearchCount>,
  ) {}

  async updateSearchCount(id: string) {
    await this.searchCountRepository
      .createQueryBuilder()
      .update()
      .where('id = :id', { id })
      .set({ count: () => 'count + 1' })
      .execute();
  }
}
