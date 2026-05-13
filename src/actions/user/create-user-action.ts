import { createUserSchema } from "@/src/lib/schemas/user-validation";
import { hashPassword } from "@/src/lib/bcrypt/hashing-password";
import { createUserService } from "@/src/services/user/user-service";
import { CreateUserDto } from "@/src/types/user-types";
import { ResponseActionTypes } from "@/src/types/response-action-types";
import { formatZodErrors } from "@/src/utils/format-zod-error";

export async function createUserAction(
  prevData: Omit<CreateUserDto, "password">,
  formData: FormData,
): Promise<
  ResponseActionTypes<Omit<CreateUserDto, "password"> | { email: string }>
> {
  if (!(formData instanceof FormData)) {
    return {
      success: false,
      errors: ["Dados inválidos"],
      data: prevData,
    };
  }

  const data = Object.fromEntries(formData.entries());
  const result = createUserSchema.safeParse(data);

  if (!result.success) {
    return {
      data: prevData,
      success: false,
      errors: formatZodErrors(result.error),
    };
  }

  const { name, email, password } = result.data;

  try {
    const newUser: CreateUserDto = {
      name,
      email,
      password: hashPassword(password),
    };

    const user = await createUserService(newUser);

    return {
      data: {
        email: user.email,
      },
      success: true,
      message: "Usuário criado com sucesso",
    };
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : `Erro desconhecido: ${error}`;
    return {
      data: prevData,
      success: false,
      errors: [msg],
    };
  }
}
