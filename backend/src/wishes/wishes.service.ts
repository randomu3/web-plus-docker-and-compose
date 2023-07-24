import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Wish } from './wish.entity';
import { CreateWishDto } from 'src/auth/dto/create-wish.dto';
import { User } from 'src/users/user.entity';
import { UpdateWishDto } from 'src/auth/dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async findUserWishes(user: User): Promise<Wish[]> {
    const wishes = await this.wishRepository.findBy({
      owner: { id: user.id },
    });
    wishes.forEach((wish) => {
      delete wish?.owner?.password;
    });
    return wishes
  }

  private sanitizeUser(wish: Wish) {
    delete wish.owner.password;
    return wish;
  }

  async create(user: User, createWishDto: CreateWishDto) {
    const wish = this.wishRepository.create({ owner: user, ...createWishDto });
    return this.sanitizeUser(await this.wishRepository.save(wish));
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {offers: true, owner: true},
    });

    if (!wish) {
      throw new NotFoundException('Не удалось найти подарок');
    }

    return this.sanitizeUser(wish);
  }

  async findAll(take: number, order: any) {
    const wishes = await this.wishRepository.find({
      take,
      order,
      relations: { owner: true, offers: true },
    });

    return wishes.map(this.sanitizeUser);
  }

  async findLast() {
    return this.findAll(40, { createdAt: 'desc' });
  }

  async findFirst() {
    return this.findAll(20, { copied: 'desc' });
  }

  private async authorizeUser(user: User, id: number) {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    return wish;
  }

  async findOneQuery(options: FindOneOptions<Wish>): Promise<Wish> {
    return (
      this.wishRepository.findOne(options) ??
      Promise.reject(new NotFoundException('Не удалось найти такие wishes'))
    );
  }

  async updateOne(user: User, id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.authorizeUser(user, id);

    if (wish.offers.length !== 0 && wish.reised !== 0) {
      throw new ForbiddenException('Обновление невозможно');
    }

    return this.wishRepository.update(id, updateWishDto);
  }

  async removeOne(user: User, id: number): Promise<void> {
    await this.authorizeUser(user, id);
    await this.wishRepository.delete(id);
  }

  async copy(user: User, id: number) {
    const wish = await this.findOne(id);

    return this.create(user, {
      name: wish.name,
      description: wish.description,
      image: wish.image,
      link: wish.link,
      price: wish.price,
    });
  }

  async updateReised(id: number, reised: number) {
    if (!(await this.wishRepository.findOne({ where: { id } }))) {
      throw new NotFoundException();
    }

    return this.wishRepository.update(id, { reised });
  }

  async getManyById(arrayOfId: Array<number>) {
    return this.wishRepository.findByIds(arrayOfId);
  }
}
