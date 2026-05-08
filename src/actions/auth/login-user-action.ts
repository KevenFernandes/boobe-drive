import { createSessionCookie } from "@/src/lib/auth/session";
import { loginUserSchema } from "@/src/lib/schemas/auth-validation";
import { loginService } from "@/src/services/auth/auth-service";
import { LoginUserDto } from "@/src/types/auth-types";
import { ResponseActionTypes } from "@/src/types/response-action-types";
import { redirect } from "next/navigation";
import z from "zod";

export async function loginAction(
  prevData: LoginUserDto,
  formData: FormData,
): Promise<ResponseActionTypes<{ email: string }>> {
  if (!(formData instanceof FormData)) {
    return {
      data: { email: prevData.email },
      success: false,
      errors: ["Dados inválidos"],
    };
  }

  const data = Object.fromEntries(formData.entries());
  const result = loginUserSchema.safeParse(data);

  if (!result.success) {
    const { errors } = z.treeifyError(result.error);

    return {
      data: { email: prevData.email },
      success: false,
      errors: errors,
    };
  }

  try {
    const user = await loginService(result.data);

    await createSessionCookie(user);

    redirect("/auth");
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : `Error desconhecido: ${error}`;

    return {
      data: { email: prevData.email },
      success: false,
      errors: [msg],
    };
  }
}
