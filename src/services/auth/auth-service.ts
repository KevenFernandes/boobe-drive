import { isAuthenticated } from "@/src/lib/auth/session";
import { comparePassword } from "@/src/lib/bcrypt/hashing-password";
import { userRepository } from "@/src/repositories/user";
import { JWTPayload, LoginUserDto } from "@/src/types/auth-types";

export async function loginService({
  email,
  password,
}: LoginUserDto): Promise<JWTPayload> {
  const user = await userRepository.findByEmail(email);

  if (!user) throw new Error("Usuário não encontrado");

  const isPassMatch = await comparePassword(password, user.password);

  if (!isPassMatch) throw new Error("Usuário ou Senha inválidos");

  return {
    sub: user.id,
    email: user.email,
  };
}

export async function authenticatedUserService(): Promise<string> {
  const session = await isAuthenticated();

  if (!session)
    throw new Error(
      "Usuário não conectado, faça login para não perder os dados digitados",
    );

  const { sub } = session;
  const user = await userRepository.findById(sub);

  if (!user) throw new Error("Usuário não encontrado");

  return sub;
}
