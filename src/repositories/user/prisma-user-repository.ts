import { prisma } from "@/src/lib/prisma/database";
import { UserRepository } from "./user-repository";
import { IUser } from "@/src/types/user-types";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({ where: { id } });
    return user;
  }

  async create(user: IUser): Promise<IUser> {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return createdUser;
  }

  async update(user: Partial<IUser>): Promise<IUser> {
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: { user },
    });

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const deleted = await prisma.user.delete({ where: { id } });

    return deleted;
  }
}
1;
