import z from "zod";

export const loginUserSchema = z.object({
  email: z.email("Email inválido").trim(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").trim(),
});

export type LoginUserSchemaTypes = z.infer<typeof loginUserSchema>;
