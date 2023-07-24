import { Controller, Get, Post, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { OffersService } from "./offers.service";
import { CreateOfferDto } from "src/auth/dto/create-offer.dto";
import { RequestUser } from "src/types/user.request";

@Controller("offers")
@UseGuards(JwtAuthGuard)
export class OffersController {
   constructor(private readonly offersService: OffersService) { }

   @Post()
   @HttpCode(HttpStatus.CREATED)
   create(@Body() createOfferDto: CreateOfferDto, @Req() req: RequestUser) {
      return this.offersService.create(req.user, createOfferDto);
   }

   @Get()
   findAll() {
      return this.offersService.findAll();
   }

   @Get(":id")
   findOne(@Param("id") id: number) {
      return this.offersService.findOne(id);
   }
}
