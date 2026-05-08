import z from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do arquivo é obrigatório")
    .max(50, "Nome muito longo"),
});

export type CreateFolderSchemaTypes = z.infer<typeof createFolderSchema>;
