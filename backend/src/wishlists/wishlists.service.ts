import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { CreateWishlistDto } from 'src/auth/dto/create-wishlist.dto';
import { User } from 'src/users/user.entity';
import { UpdateWishlistDto } from 'src/auth/dto/update-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>, 
    private wishesService: WishesService
  ) {}

  private sanitizeUser(wishlist: Wishlist) {
    delete wishlist.user.password;
    return wishlist;
  }

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.getManyById(createWishlistDto.itemsId);
    const wishlist = this.wishlistRepository.create({ ...createWishlistDto, items: wishes, user: user });
    
    return this.sanitizeUser(await this.wishlistRepository.save(wishlist));
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({ where: { id }, relations: ['user', 'items'] });

    if (!wishlist) {
       throw new NotFoundException('Коллекций не найдено');
    }

    return this.sanitizeUser(wishlist);
  }

  async findMany(): Promise<Wishlist[]> {
    const wishlist = await this.wishlistRepository.find({ relations: ['user', 'items'] });
    
    return wishlist.map(this.sanitizeUser);
  }

  private async checkOwnership(user: User, id: number) {
    const wishlist = await this.wishlistRepository.findOne({ where: { id }, relations: ['user'] });

    if (!wishlist || wishlist.user.id !== user.id) {
       throw new NotFoundException();
    }
    
    return wishlist;
  }

  async updateOne(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.checkOwnership(user, id);
    
    const wishes = await this.wishesService.getManyById(updateWishlistDto.itemsId);
    delete updateWishlistDto.itemsId;
    
    await this.wishlistRepository.save({ ...wishlist, ...updateWishlistDto, items: wishes });

    return this.findOne(id);
  }

  async removeOne(user: User, id: number): Promise<Wishlist> {
    const wishlist = await this.checkOwnership(user, id);

    const removed = await this.wishlistRepository.remove(wishlist);
    
    return this.sanitizeUser(removed);
  }
}
