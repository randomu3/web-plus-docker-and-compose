import { IsNumber, IsDate } from "class-validator";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("Base")
export class Base {
   @PrimaryGeneratedColumn()
   @IsNumber()
   id: number;

   @CreateDateColumn()
   @IsDate()
   createdAt: Date;

   @UpdateDateColumn()
   @IsDate()
   updatedAt: Date;
}