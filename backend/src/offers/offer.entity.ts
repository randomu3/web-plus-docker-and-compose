import { IsBoolean, IsNumber } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Base } from 'src/utils/base.entity';
import { Wish } from 'src/wishes/wish.entity';
import { Column, Entity, ManyToOne, ColumnOptions } from 'typeorm';

@Entity('Offer')
export class Offer extends Base {
  @Column({ type: 'decimal', scale: 2 } as ColumnOptions)
  @IsNumber()
  amount: number;

  @Column({ type: 'boolean', default: false } as ColumnOptions)
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  gift: Wish;
}
