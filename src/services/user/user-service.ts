import { userRepository } from "@/src/repositories/user";
import { CreateUserDto, IUser, UpdateUserDto } from "@/src/types/user-types";

export async function createUserService(user: CreateUserDto): Promise<IUser> {
  const existingUser = await userRepository.findByEmail(user.email);

  if (existingUser) {
    throw new Error("Error ao criar conta, tente outro email.");
  }

  const userCreated = await userRepository.create(user);

  return userCreated;
}

export async function updateUserService(user: UpdateUserDto, userId: string) {
  if (!user.email && !user.name) throw new Error("Nenhum dado passado");

  const updatedUser = await userRepository.update(user, userId);

  if (!updatedUser) throw new Error("Falha ao atualizar usuário");

  return updatedUser;
}
