import { Test, TestingModule } from '@nestjs/testing';
import { SearchCountController } from './search_count.controller';

describe('SearchCountController', () => {
  let controller: SearchCountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchCountController],
    }).compile();

    controller = module.get<SearchCountController>(SearchCountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
