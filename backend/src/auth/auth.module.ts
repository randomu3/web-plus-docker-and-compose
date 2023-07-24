import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HashService } from "src/hash/hash.service";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";

@Module({
   imports: [
      PassportModule,
      UsersModule,
      ConfigModule,
      JwtModule.registerAsync({
         imports: [ConfigModule],
         useFactory: async (configService: ConfigService) => ({ 
           secret: 'secret_key',
           signOptions: { expiresIn: "30d" }
         }),
         inject: [ConfigService]
      })
   ],
   providers: [AuthService, JwtStrategy, LocalStrategy, HashService],
   exports: [AuthService],
   controllers: [AuthController]
})
export class AuthModule { }