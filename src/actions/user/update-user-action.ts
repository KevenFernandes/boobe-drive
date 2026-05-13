import { updateUserSchema } from "@/src/lib/schemas/user-validation";
import { authenticatedUserService } from "@/src/services/auth/auth-service";
import { updateUserService } from "@/src/services/user/user-service";
import { ResponseActionTypes } from "@/src/types/response-action-types";
import { UpdateUserDto } from "@/src/types/user-types";
import { formatZodErrors } from "@/src/utils/format-zod-error";

export async function updateUserAction(
  prevData: UpdateUserDto,
  formData: FormData,
): Promise<ResponseActionTypes<UpdateUserDto>> {
  if (!(formData instanceof FormData)) {
    return {
      data: prevData,
      success: false,
      errors: ["Dados inválidos"],
    };
  }

  const userId = await authenticatedUserService();

  const data = Object.fromEntries(formData.entries());
  const result = updateUserSchema.safeParse(data);

  if (!result.success) {
    return {
      data: prevData,
      success: false,
      errors: formatZodErrors(result.error),
    };
  }

  try {
    const updatedUser = await updateUserService(result.data, userId);

    return {
      data: updatedUser,
      success: true,
      message: "Usuário atualizado com sucesso",
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
