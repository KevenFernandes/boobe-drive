import { IUser, UpdateUserDto } from "@/src/types/user-types";

export interface UserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;

  create(user: IUser): Promise<IUser>;
  update(user: UpdateUserDto, userId: string): Promise<IUser>;
  delete(id: string): Promise<void>;
}
