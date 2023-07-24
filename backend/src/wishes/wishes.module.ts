import { Module } from '@nestjs/common';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
  ],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService]
})
export class WishesModule {}
