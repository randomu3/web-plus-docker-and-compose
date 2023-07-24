import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WishlistService } from './wishlists.service';
import { CreateWishlistDto } from 'src/auth/dto/create-wishlist.dto';
import { UpdateWishlistDto } from 'src/auth/dto/update-wishlist.dto';
import { RequestUser } from 'src/types/user.request';
import { Wishlist } from './wishlist.entity';

@Controller('wishlistlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistService) {}

  @Post()
  async createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: RequestUser,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(req.user, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findMany();
  }

  @Get(':id')
  async getWishlistById(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  async updateWishlist(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: RequestUser,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateOne(
      req.user,
      id,
      updateWishlistDto,
    );
  }

  @Delete(':id')
  async deleteWishlist(
    @Param('id') id: number,
    @Req() req: RequestUser,
  ): Promise<Wishlist> {
    return await this.wishlistsService.removeOne(req.user, id);
  }
}
