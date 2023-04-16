import { Controller, Put, Version } from '@nestjs/common';
import { SearchCountService } from './search_count.service';

@Controller('search-count')
export class SearchCountController {
  constructor(private readonly searchCountService: SearchCountService) {}

  @Version('2')
  @Put('/')
  async updateSearchCount() {
    await this.searchCountService.updateSearchCount('search');

    return true;
  }
}
