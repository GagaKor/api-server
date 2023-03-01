import { Test, TestingModule } from '@nestjs/testing';
import { SearchCountService } from './search_count.service';

describe('SearchCountService', () => {
  let service: SearchCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchCountService],
    }).compile();

    service = module.get<SearchCountService>(SearchCountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
