import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './login-response.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne({ where: { username }});
    console.log(user);
    const passwordOk =
      user && (await this.hashService.compare(password, user.password));

    if (!passwordOk) {
      return null;
    }
    delete user.password;

    return user;
  }

  async auth(userId: number): Promise<LoginResponse> {
    const token = await this.jwtService.signAsync({ userId });
    return { access_token: token };
  }
}
