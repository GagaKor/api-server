import { Controller, Get, Param, Version } from '@nestjs/common';
import { PlaceService } from 'src/place/place.service';
import { ChartService } from './chart.service';

@Controller('chart')
export class ChartController {
  constructor(
    private readonly chartService: ChartService,
    private readonly placeService: PlaceService,
  ) {}

  @Version('1')
  @Get('/:chartName')
  async getChartByName(@Param('chartName') chartName) {
    const placeIdList = await this.chartService.findPlaceIdListByName(
      chartName,
    );

    if (placeIdList.length === 0) {
      return [];
    }

    const places = await this.placeService.findByIdList(placeIdList);
    places.map((place) => {
      place['place_name'] = place['name'];
      delete place['name'];
    });
    return places;
  }
}
