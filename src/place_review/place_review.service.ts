import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreatePlaceReviewDto } from './dto/create.place_review.dto';
import { PlaceReview } from './Entity/place_review.entity';
import { Place } from './../place/Entity/place.entity';
import { User } from 'src/auth/Entity/user.entity';
import { generateUuid } from './../utils/gnerator';
import { CntAndScoreDto } from './dto/cntAndScore.dto';
@Injectable()
export class PlaceReviewService {
  constructor(
    @InjectRepository(PlaceReview)
    private readonly placeReviewRepository: Repository<PlaceReview>,
  ) {}

  async findByPlaceId(placeId: string): Promise<PlaceReview[]> {
    return this.placeReviewRepository.find({
      select: { user: { nickname: true } },
      relations: {
        user: true,
        review_mood: true,
      },
      where: {
        place: {
          id: placeId,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async createReview(
    createPlaceReviewDto: CreatePlaceReviewDto,
    place: Place,
    user: User,
    queryRunnerManager: EntityManager,
  ): Promise<PlaceReview> {
    const {
      participants,
      rating,
      price_range,
      is_cork_charge,
      is_reservation,
      is_room,
      is_parking,
      is_advance_payment,
      is_rent,
      simple_review,
    } = createPlaceReviewDto;

    const newReview = new PlaceReview();

    newReview.id = generateUuid();
    newReview.place = place;
    newReview.participants = participants;
    newReview.rating = rating;
    newReview.price_range = price_range;
    newReview.is_cork_charge = is_cork_charge;
    newReview.is_reservation = is_reservation;
    newReview.is_room = is_room;
    newReview.is_parking = is_parking;
    newReview.is_advance_payment = is_advance_payment;
    newReview.is_rent = is_rent;
    newReview.simple_review = simple_review;
    newReview.user = user;
    try {
      const result = await queryRunnerManager.save(newReview);
      return result;
    } catch (err) {
      throw new ConflictException(
        `${err}. Create PlaceReview Failed to Transaction`,
      );
    }
  }

  async calCntAndScore(
    placeId: string,
    queryRunnerManager: EntityManager,
  ): Promise<CntAndScoreDto> {
    try {
      const cntAndScore: CntAndScoreDto = await queryRunnerManager
        .createQueryBuilder(PlaceReview, 'placeReview')
        .select('COUNT(placeReview.rating) as cnt')
        .addSelect('ROUND(AVG(placeReview.rating),1) as score')
        .leftJoin('placeReview.place', 'place')
        .groupBy('place.id')
        .having('place.id = :placeId', { placeId })
        .getRawOne();
      console.log(cntAndScore);
      return cntAndScore;
    } catch (err) {
      throw new NotFoundException(
        `${err}. Select Cnt And Score Failed to Transaction`,
      );
    }
  }

  async findById(id: string): Promise<PlaceReview> {
    return await this.placeReviewRepository.findOne({
      relations: {
        place: true,
        review_mood: true,
      },
      where: {
        id,
      },
    });
  }

  async findByIndWithTransaction(
    id: string,
    transactionManager: EntityManager,
  ): Promise<PlaceReview> {
    return await transactionManager.findOne(PlaceReview, {
      relations: { review_mood: true },
      where: { id },
    });
  }

  async findByUser(userInfo: User): Promise<PlaceReview[]> {
    return await this.placeReviewRepository.find({
      relations: {
        place: true,
      },
      where: {
        user: {
          id: userInfo.id,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async reviewByPlaceId(placeId: string): Promise<PlaceReview[]> {
    return this.placeReviewRepository.find({
      select: {
        simple_review: true,
        rating: true,
        createdAt: true,
        user: { nickname: true },
      },
      relations: {
        user: true,
      },
      where: {
        place: {
          id: placeId,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
}
