import { User } from "src/users/user.entity";

export interface RequestUser extends Request {
   user: User;
}