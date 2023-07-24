import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Offer } from '../offers/offer.entity';
import { IsInt, IsNumber, IsUrl, Length } from 'class-validator';
import { Base } from 'src/utils/base.entity';

@Entity()
export class Wish extends Base {
  @Column({ length: 250 })
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  @IsNumber()
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsNumber()
  reised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({ length: 1024 })
  @Length(1, 1024)
  description: string;

  @ManyToMany(() => Offer)
  @JoinTable()
  offers: Offer[];

  @Column('int', { default: 0 })
  @IsInt()
  copied: number;
}
