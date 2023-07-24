import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { CreateOfferDto } from 'src/auth/dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService
  ) {}

  async create(user: User, { amount, hidden, itemId }: CreateOfferDto) {
    const wish = await this.wishesService.findOneQuery({ where: { id: itemId }, relations: { offers: true, owner: true } });

    if (wish.owner.id === user.id) {
      throw new ForbiddenException("Действие не разрешено. Вы не можете создать предложение по собственному желанию.");
    }

    const reised = amount + wish.reised;

    if (reised > wish.price) {
      throw new ForbiddenException("Сумма предложения превышает цену подарка.");
    }

    await this.wishesService.updateReised(wish.id, reised);
    const offer = this.offersRepository.create({ amount, hidden, gift: wish, user });
    await this.offersRepository.save(offer);

    return {};
  }

  async findAll() {
    const offers = await this.offersRepository.find({ relations: { gift: true, user: true } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return offers.map(({ user: { password, ...user }, ...offer }) => ({ ...offer, user }));
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.findOne({ where: { id }, relations: { gift: true, user: true } });

    if (!offer) {
      throw new NotFoundException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user: { password, ...user }, ...other } = offer;

    return { ...other, user };
  }
}
