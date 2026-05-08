import z from "zod";

export const loginUserSchema = z.object({
  email: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "O nome é muito longo")
    .trim(),

  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").trim(),
});

export type LoginUserSchemaTypes = z.infer<typeof loginUserSchema>;
