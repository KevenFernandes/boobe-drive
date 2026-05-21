import { ACCEPT_FILE, MAX_SIZE_FILE } from "@/src/types/file-types";
import z from "zod";

export const createFileSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do arquivo é obrigatório")
    .max(255, "Nome muito longo"),

  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional()
    .nullable(),

  file: z
    .instanceof(File, { message: "Selecione um arquivo válido" })
    .refine((file) => file.size <= MAX_SIZE_FILE, "O tamanho máximo é de 5MB")
    .refine((file) => ACCEPT_FILE.includes(file.type), "Arquivo não suportado"),

  folderId: z.uuid("ID da pasta inválido").optional().nullable(),
});

export const updateFileSchema = createFileSchema
  .omit({ file: true })
  .partial()
  .extend({ id: z.uuid("ID inválido") });

export type CreateFileSchemaTypes = z.infer<typeof createFileSchema>;
export type UpdateFileSchemaTypes = z.infer<typeof updateFileSchema>;
