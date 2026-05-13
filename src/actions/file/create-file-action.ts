import { createFileSchema } from "@/src/lib/schemas/file-validation";
import {
  ACCEPT_FILE,
  CreateFileDto,
  IFile,
  MAX_SIZE_FILE,
} from "@/src/types/file-types";
import { createFileService } from "@/src/services/file/file-service";
import { authenticatedUserService } from "@/src/services/auth/auth-service";
import { ResponseActionTypes } from "@/src/types/response-action-types";
import { formatZodErrors } from "@/src/utils/format-zod-error";

export async function createFileAction(
  prevData: CreateFileDto,
  formData: FormData,
): Promise<ResponseActionTypes<CreateFileDto | IFile>> {
  if (!(formData instanceof FormData)) {
    return {
      data: prevData,
      success: false,
      errors: ["Formato de dados inválidos."],
    };
  }

  const userId = await authenticatedUserService();

  const data = Object.fromEntries(formData);
  const result = createFileSchema.safeParse(data);

  if (!result.success) {
    return {
      data: prevData,
      success: false,
      errors: formatZodErrors(result.error),
    };
  }

  const file = result.data.file;
  if (!(file instanceof File)) {
    return {
      data: prevData,
      success: false,
      errors: ["Dados inválidos"],
    };
  }
  if (!ACCEPT_FILE.includes(file.type)) {
    return {
      data: prevData,
      success: false,
      errors: ["Formato do arquivo inválido"],
    };
  }

  if (file.size > MAX_SIZE_FILE) {
    return {
      data: prevData,
      success: false,
      errors: ["Arquivo muito grande"],
    };
  }

  try {
    const fileCreated = await createFileService(result.data, userId);

    return {
      data: fileCreated,
      success: true,
      message: "Arquivo salvo com sucesso",
    };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : `Error desconhecido: ${error}`;
    return {
      data: prevData,
      success: false,
      errors: [msg],
    };
  }
}
