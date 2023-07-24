import { IsString, IsUrl, Length, IsOptional } from "class-validator";
import { User } from "src/users/user.entity";
import { Base } from "src/utils/base.entity";
import { Wish } from "src/wishes/wish.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity("Wishlist")
export class Wishlist extends Base {
   @Column()
   @IsString()
   @Length(1, 250)
   name: string;

   @Column({ default: "Описание по умолчанию" })
   @IsString()
   @IsOptional()
   @Length(1, 1500)
   description?: string;

   @Column()
   @IsString()
   @IsUrl()
   image: string;

   @ManyToMany(() => Wish, { cascade: true })
   @JoinTable()
   items: Wish[];

   @ManyToOne(() => User, (user) => user.whishlist)
   user: User;
}
