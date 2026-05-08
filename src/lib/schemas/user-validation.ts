import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "O nome é muito longo")
    .trim(),

  email: z.email("Insira um e-mail válido").toLowerCase().trim(),

  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").trim(),
});

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial();

export type CreateUserSchemaTypes = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaTypes = z.infer<typeof updateUserSchema>;
