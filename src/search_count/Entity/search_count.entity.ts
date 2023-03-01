import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class SearchCount {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  count: number;
}
