import { updateFileSchema } from "@/src/lib/schemas/file-validation";
import { authenticatedUserService } from "@/src/services/auth/auth-service";
import { updateFileService } from "@/src/services/file/file-service";
import { IFile, UpdateFileDto } from "@/src/types/file-types";
import { ResponseActionTypes } from "@/src/types/response-action-types";
import z from "zod";

export async function updateFileAction(
  prevData: UpdateFileDto,
  formData: FormData,
): Promise<ResponseActionTypes<UpdateFileDto | IFile>> {
  if (!(formData instanceof FormData)) {
    return {
      data: prevData,
      success: false,
      errors: ["Dados inválidos"],
    };
  }

  await authenticatedUserService();

  const data = Object.fromEntries(formData.entries());
  const result = updateFileSchema.safeParse(data);

  if (!result.success) {
    const { errors } = z.treeifyError(result.error);

    return {
      data: prevData,
      success: false,
      errors,
    };
  }

  try {
    const updatedFile = await updateFileService(result.data);

    return {
      data: updatedFile,
      success: true,
      message: "Arquivo atualizado com sucesso",
    };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : `Erro desconhecido: ${error}`;

    return {
      data: prevData,
      success: false,
      errors: [msg],
    };
  }
}
