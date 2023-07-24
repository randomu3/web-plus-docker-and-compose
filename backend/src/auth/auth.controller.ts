import { Controller, Post, UseGuards, Req, Body } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { LoginResponse } from "./login-response.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { RequestUser } from "src/types/user.request";
import { User } from "src/users/user.entity";
import { LocalGuard } from "./guards/local-auth.guard";

@Controller()
export class AuthController {
   constructor(private authService: AuthService, private usersService: UsersService) { }

   @UseGuards(LocalGuard)
   @Post("signin")
   async signin(@Req() req: RequestUser): Promise<LoginResponse> {
      console.log(req.user)
      return await this.authService.auth(req.user.id);
   }

   @Post("signup")
   async signup(@Body() createUserDto: CreateUserDto): Promise<{ user: Omit<User, "password">, token: LoginResponse }> {
      const user = await this.usersService.create(createUserDto);
      const token = await this.authService.auth(user.id);
      return { user, token };
   }
}