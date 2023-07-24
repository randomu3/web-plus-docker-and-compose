import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, UseGuards } from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { HttpStatus } from "@nestjs/common/enums";
import { CreateWishDto } from "src/auth/dto/create-wish.dto";
import { UpdateWishDto } from '../auth/dto/update-wish.dto' 
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RequestUser } from "src/types/user.request";
import { Wish } from './wish.entity';

@Controller("wishes")
export class WishesController {
   constructor(private readonly wishesService: WishesService) {}

   @UseGuards(JwtAuthGuard)
   @HttpCode(HttpStatus.CREATED)
   @Post()
   async createWish(@Body() createWishDto: CreateWishDto, @Req() req: RequestUser): Promise<Wish> {
      return await this.wishesService.create(req.user, createWishDto);
   }

   @Get("last")
   async getLastWishes(): Promise<Wish[]> {
      return await this.wishesService.findLast();
   }

   @Get("top")
   async getTopWishes(): Promise<Wish[]> {
      return await this.wishesService.findFirst();
   }

   @UseGuards(JwtAuthGuard)
   @Get(":id")
   async getWishById(@Param("id") id: string): Promise<Wish> {
      return await this.wishesService.findOne(+id);
   }

   @UseGuards(JwtAuthGuard)
   @Patch(":id")
   async updateWish(@Req() req: RequestUser, @Param("id") id: string, @Body() updateWishDto: UpdateWishDto) {
      return await this.wishesService.updateOne(req.user, +id, updateWishDto);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(":id")
   async deleteWish(@Param("id") id: string, @Req() req: RequestUser): Promise<void> {
      return await this.wishesService.removeOne(req.user, +id);
   }

   @UseGuards(JwtAuthGuard)
   @HttpCode(HttpStatus.CREATED)
   @Post(":id/copy")
   async copyWish(@Param("id") id: string, @Req() req: RequestUser): Promise<Wish> {
      return await this.wishesService.copy(req.user, +id);
   }
}
