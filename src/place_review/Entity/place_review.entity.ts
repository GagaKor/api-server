import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/Entity/user.entity';
import { Place } from 'src/place/Entity/place.entity';
import { ReviewMood } from 'src/review_mood/Entity/review_mood.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlaceReview {
  @ApiProperty({
    required: false,
    type: String,
  })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({
    required: false,
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.place_Reviews, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: User;

  @ApiProperty({
    required: false,
    type: () => ReviewMood,
    isArray: true,
  })
  @OneToMany(() => ReviewMood, (reviewMood) => reviewMood.place_review, {
    cascade: true,
    eager: false,
  })
  review_mood: ReviewMood[];

  @ApiProperty({
    required: false,
    type: () => Place,
  })
  @ManyToOne(() => Place, (place) => place.place_review, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place: Place;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Column()
  participants: number; // 변경 필요 인원 수

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Column()
  rating: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column()
  price_range: string;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_cork_charge: boolean; // 콜키지

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_room: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_reservation: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_parking: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_advance_payment: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_rent: boolean;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column()
  simple_review: string; // 한줄평

  @ApiProperty({
    required: false,
    type: Date,
  })
  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
