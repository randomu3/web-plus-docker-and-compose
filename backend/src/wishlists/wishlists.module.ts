import { Module } from '@nestjs/common';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { WishlistService } from './wishlists.service';
import { WishesService } from 'src/wishes/wishes.service';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
    WishesModule
  ],
  controllers: [WishlistsController],
  providers: [WishlistService],
  exports: [WishlistService]
})
export class WishlistsModule {}
