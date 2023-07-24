import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Body,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { FindManyUserDto } from 'src/auth/dto/find-many-user.dto';
import { RequestUser } from 'src/types/user.request';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getAuthenticatedUser(@Req() req: RequestUser) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  async updateAuthenticatedUser(
    @Req() req: RequestUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(req.user, updateUserDto)
    return this.usersService.updateOne(req.user, updateUserDto);
  }

  @Get('me/wishes')
  async getWishesForAuthenticatedUser(@Req() req: RequestUser) {
    return this.usersService.getWishes(req.user);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({ where: { username } });
    return await this.usersService.getWishes(user);
  }

  @Post('find')
  async findUser(@Body() findManyUserDto: FindManyUserDto) {
    return await this.usersService.findMany(findManyUserDto.query);
  }
}
