import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Query,
  Version,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { PlaceInfoService } from './placeInfo.service';
import { AddPlace } from './dto/addPlace.dto';
import { ExistsPlace } from './dto/existsPlace.dto';
import { Place } from './Entity/place.entity';
import { PlaceInfo } from './Entity/placeInfo.entity';
import { GetAllPlace } from './types/getAllPlace.type';
import { GetPlaceDetail } from './types/getPlaceDetail.type';
import { GetPlaceSearch } from './types/getPlaceSearch.type';

@ApiTags('Place Api')
@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly placeInfoService: PlaceInfoService,
  ) {}

  @Version('1')
  @Get('/exists/:kakaoId')
  @ApiOperation({
    summary: 'isExists',
    description: '장소가 저장되어 있는지 여부',
  })
  @ApiParam({
    name: 'kakaoId',
    required: true,
    description: '카카오 장소 id',
  })
  @ApiResponse({
    description: '장소저장 시에 uuid 반환, 없는 경우 id 빈값',
    type: ExistsPlace,
    status: 200,
  })
  async isExsitsKakaoPlace(
    @Param('kakaoId') kakaoId: string,
  ): Promise<ExistsPlace> {
    const id = await this.placeService.isExistsByKakaoId(kakaoId);

    return {
      id,
    };
  }

  @Version('1')
  @Get('/')
  async findByAll(): Promise<Place[]> {
    return await this.placeService.findAll();
  }

  @Version('1')
  @Post('/')
  @ApiOperation({ summary: 'Create', description: 'create place data' })
  @ApiResponse({
    status: 400,
    description: '이미 등록된 장소입니다.',
  })
  @ApiCreatedResponse({
    description: 'place',
    type: Place,
  })
  async add(@Body() addPlace: AddPlace): Promise<Place> {
    const place = await this.placeService.createPlace(addPlace);

    return place;
  }

  @Version('1')
  @Get('/info/:id')
  @ApiOperation({ summary: 'GetPlaceInfo', description: '장소 상세 정보 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'placeInfo id',
  })
  @ApiResponse({
    description: 'placeInfo',
    type: PlaceInfo,
  })
  async getPlaceInfoById(@Param('id') id: string) {
    const placeInfo = await this.placeInfoService.getPlaceInfoById(id);

    return placeInfo;
  }

  @Version('1')
  @Get('/reviewed')
  @ApiOperation({
    summary: 'GetPlaces',
    description: '리뷰가 작성된 장소 목록 조회',
  })
  @ApiResponse({
    description: 'get all place',
    type: GetAllPlace,
    isArray: true,
  })
  async getAllPlace() {
    const places = await this.placeService.findAll();

    return places;
  }

  @Version('1')
  @Get('/detail/:id')
  @ApiOperation({
    summary: 'Get Place Details',
    description: '장소 상세 정보',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiResponse({
    description: 'Get Place Details',
    type: GetPlaceDetail,
  })
  async getPlaceDetailsByKakaoID(
    @Param('id') id: string,
  ): Promise<GetPlaceDetail> {
    const place = await this.placeService.isExistsById(id);
    if (!place) return;

    return await this.placeService.findPlaceDetail(id);
  }

  @Version('1')
  @Get('/search/:kakaoId')
  @ApiOperation({
    summary: 'Get Place Search',
    description: '장소 검색 기본 정보',
  })
  @ApiParam({
    name: 'kakaoId',
    required: true,
    type: String,
  })
  @ApiResponse({
    description: 'Get Place Search Data',
    type: GetPlaceSearch,
  })
  async getPlaceSearchByKakaId(
    @Param('kakaoId') kakaoId: string,
  ): Promise<GetPlaceSearch> {
    const place = await this.placeService.kakaoIdByPlace(kakaoId);
    if (!place) return;
    const result = await this.placeService.findByIdForSearch(place.id);

    return result;
  }

  @Version('1')
  @ApiOperation({
    summary: 'Keyword Search',
    description: '키워드 검색 qs 파싱후 전달',
  })
  @ApiQuery({
    name: 'keyword',
    type: GetPlaceSearch,
    isArray: true,
  })
  @Get('/keyword')
  async KeywwordSearch(
    @Query('keyword') keyword: string,
  ): Promise<GetPlaceSearch[]> {
    const parseKeyword = this.placeService.parseKeyword(keyword);
    return await this.placeService.placeKeywordSearch(parseKeyword);
  }

  @Version('1')
  @Get('/:kakaoId')
  async findByKakaoId(@Param('kakaoId') kakaoId: string) {
    const isExists = await this.placeService.isExistsByKakaoId(kakaoId);

    if (!isExists) throw new NotFoundException('Can not find Place');

    const place = await this.placeService.kakaoIdByPlace(kakaoId);

    return await this.placeService.findByIdForSearch(place.id);
  }
}
