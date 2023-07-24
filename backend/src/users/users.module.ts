import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { HashModule } from 'src/hash/hash.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WishesModule,
    HashModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
