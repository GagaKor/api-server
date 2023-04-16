import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ConflictException,
  Delete,
  Param,
  Version,
} from '@nestjs/common';
import { GetUser } from 'src/decorator/get-user.decorator';
import { WantPlaceService } from './want_place.service';
import { User } from 'src/auth/Entity/user.entity';
import { WantPlace } from 'src/want_place/Entity/want_place.entity';
import { PlaceService } from './../place/place.service';
import { AuthGuard } from 'src/auth/security/jwt.Guard';
import { CreateWantPlaceDto } from './dto/create.wantPlace.dto';
import { DeleteWantPlaceDto } from './dto/delete.wantPlace.dto';
import { WantPlaceAndPlace } from './types/wantPlaceAndPlace.type';
import { DeleteResult } from 'typeorm';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('want-place')
export class WantPlaceController {
  constructor(
    private readonly wantPlaceService: WantPlaceService,
    private readonly placeService: PlaceService,
  ) {}

  @Version('1')
  @ApiOperation({
    summary: 'Get my WantPlaces',
    description: 'Get my WanPlace List',
  })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiResponse({
    status: 200,
    description: 'Want_palce Result',
    type: WantPlaceAndPlace,
    isArray: true,
  })
  @Get('/my/list')
  @UseGuards(AuthGuard)
  async findByUser(@GetUser() user: User) {
    return this.wantPlaceService.findByUser(user);
  }

  @Version('1')
  @ApiOperation({
    summary: 'getCountByPlaceId',
    description: '장소 가고싶은 곳 등록 횟수',
  })
  @ApiParam({ name: 'placeId', description: '장소 ID', type: String })
  @Get('/:placeId/count')
  async getCountById(@Param('placeId') placeId: string): Promise<number> {
    return this.wantPlaceService.getCountByPlaceId(placeId);
  }

  @Version('1')
  @ApiOperation({ summary: 'createWantPlace', description: 'createWantPlace' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiBody({
    description: 'CreateWantPlaceDto',
    required: true,
    type: CreateWantPlaceDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Want_palce Result',
    type: WantPlace,
  })
  @Post()
  @UseGuards(AuthGuard)
  async createWantPlace(
    @Body() createWantPlaceDto: CreateWantPlaceDto,
    @GetUser() user: User,
  ): Promise<WantPlace> {
    const place = await this.placeService.findById(createWantPlaceDto.placeId);
    const checkWantPlace = await this.wantPlaceService.checkWantPlace(
      place.id,
      user.id,
    );
    //이미 저장한 경우 저장 불가
    if (!checkWantPlace)
      throw new ConflictException('Already have a this Place');

    return this.wantPlaceService.createWantPlace(place, user);
  }

  @Version('1')
  @ApiOperation({ summary: 'deleteWantPlace', description: 'deleteWantPlace' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiBody({
    description: 'DeleteWantPlaceDto',
    required: true,
    type: DeleteWantPlaceDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Delete Want_palce Result',
    type: WantPlace,
  })
  @Delete()
  @UseGuards(AuthGuard)
  async deleteWantPlace(
    @Body() deleteWantPlaceDto: DeleteWantPlaceDto,
  ): Promise<DeleteResult> {
    return this.wantPlaceService.deleteWantPlace(deleteWantPlaceDto.id);
  }
}
