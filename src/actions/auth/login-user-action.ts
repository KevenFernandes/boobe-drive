"use server";

import { createSessionCookie } from "@/src/lib/auth/session";
import { loginUserSchema } from "@/src/lib/schemas/auth-validation";
import { loginService } from "@/src/services/auth/auth-service";
import type { ResponseActionTypes } from "@/src/types/response-action-types";
import { formatZodErrors } from "@/src/utils/format-zod-error";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function loginAction(
  prevData: ResponseActionTypes<{ email: string }>,
  formData: FormData,
): Promise<ResponseActionTypes<{ email: string }>> {
  if (!(formData instanceof FormData)) {
    return {
      data: { email: prevData.data.email },
      success: false,
      errors: ["Dados inválidos"],
    };
  }

  const data = Object.fromEntries(formData.entries());
  const result = loginUserSchema.safeParse(data);

  if (!result.success) {
    return {
      data: { email: prevData.data.email },
      success: false,
      errors: formatZodErrors(result.error),
    };
  }

  let shouldRedirect = false;

  try {
    const user = await loginService(result.data);

    await createSessionCookie(user);

    shouldRedirect = true;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : `Error desconhecido: ${error}`;

    if (isRedirectError(error)) {
      throw error;
    }

    return {
      data: { email: result.data.email },
      success: false,
      errors: [msg],
    };
  }

  if (shouldRedirect) {
    redirect("/dashboard");
  }

  return {
    data: { email: result.data.email },
    success: true,
    message: "Login efetuado com sucesso.",
  };
}
