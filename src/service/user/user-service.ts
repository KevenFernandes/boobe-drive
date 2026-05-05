import { createSessionCookie } from "@/src/lib/auth/session";
import { comparePassword } from "@/src/lib/bcrypt/hashing-password";
import { userPrismaRepository } from "@/src/repositories/user";
import { JWTPayload } from "@/src/types/auth/auth-types";

type loginDto = {
  email: string;
  password: string;
};

export async function authenticatedUser({
  email,
  password,
}: loginDto): Promise<JWTPayload> {
  const user = await userPrismaRepository.findByEmail(email);

  if (!user) throw new Error("Usuário não encontrado");

  const isPassMatch = await comparePassword(password, user.password);

  if (!isPassMatch) throw new Error("Usuário ou Senha inválidos");

  return {
    sub: user.id,
    email: user.email,
  };
}
