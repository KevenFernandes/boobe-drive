import bcrypt from "bcrypt";

export function hashPassword(password: string, salt: number = 10): string {
  const saltRounds = salt;
  const genSalt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, genSalt);
  return hash;
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const match = await bcrypt.compare(password, hash);
  return match;
}
