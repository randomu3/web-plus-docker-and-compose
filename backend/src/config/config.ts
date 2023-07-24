import { ConfigService } from "@nestjs/config";
import { Offer } from "src/offers/offer.entity";
import { User } from "src/users/user.entity";
import { Wish } from "src/wishes/wish.entity";
import { Wishlist } from "src/wishlists/wishlist.entity";

export const typeOrmConfig = (configService: ConfigService) => ({
   type: configService.get("DB_TYPE"),
   host: configService.get("DB_HOST"),
   port: configService.get("DB_PORT"),
   username: configService.get("DB_USERNAME"),
   password: configService.get("DB_PASSWORD"),
   database: configService.get("DB_DATABASE"),
   entities: [User, Wish, Wishlist, Offer],
   synchronize: configService.get("DB_SYNCHRONIZE"),
});