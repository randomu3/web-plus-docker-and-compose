import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wish } from '../wishes/wish.entity';
import { Offer } from '../offers/offer.entity';
import { Wishlist } from '../wishlists/wishlist.entity';
import { Base } from 'src/utils/base.entity';

@Entity() 
export class User extends Base {
  @Column({ unique: true, length: 30 }) 
  username: string; 

  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  about: string; 

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string; 

  @Column({ unique: true })
  email: string; 

  @Column()
  password: string; 

  @OneToMany(() => Wish, (wish) => wish.owner) 
  wishes: Wish[]; 

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]; 

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  whishlist: Wishlist[];
}
