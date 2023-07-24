import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly wishesService: WishesService,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const { username, email, password } = userData;

    const userExists = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = await this.userRepository.save({
      ...userData,
      password: hashedPassword,
    });

    delete user.password;
    return user;
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    console.log(options)
    const user = await this.userRepository.findOne(options);
    console.log(user)

    if (!user) {
      throw new NotFoundException('Такой пользователь не найден');
    }

    return user;
  }

  async getWishes(user: User) {
    return this.wishesService.findUserWishes(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.findOne({ where: { id } });

    return user;
  }

  async findMany(query: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async updateOne(user: User, data: UpdateUserDto): Promise<User> {
    if (data.username && user.username !== data.username) {
      const userWithThisName = await this.userRepository.findOne({ where: { username: data.username }});

      if (userWithThisName) {
        throw new BadRequestException('Имя профиля занято');
      }
    }

    if (data.email && user.email !== data.email) {
      const userWithThisEmail = await this.userRepository.findOne({ where: { email: data.email } });

      if (userWithThisEmail) {
        throw new BadRequestException('Такой email занят');
      }
    }

    if (data.password) {
      data.password = await this.hashService.hash(data.password);
    }

    await this.userRepository.update(user.id, {
      ...user,
      username: data?.username,
      password: data?.password,
      email: data?.email,
      about: data?.about,
      avatar: data?.avatar,
    });

    const updatedUser = await this.userRepository.findOne({ where: { id: user.id } });

    return updatedUser;
  }
}
