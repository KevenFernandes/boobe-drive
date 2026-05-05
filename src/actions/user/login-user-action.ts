import { createSessionCookie } from "@/src/lib/auth/session";
import { authenticatedUser } from "@/src/service/user/user-service";

type ResponseActionTypes = {
  data: {
    email: string;
  };
  message: string;
  error?: string;
};

export async function loginAction(
  formData: FormData,
): Promise<ResponseActionTypes> {
  if (!(formData instanceof FormData)) {
    return {
      data: {
        email: "",
      },
      message: "Formato de dados inválidos",
    };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (typeof email !== "string" || regexEmail.test(email)) {
    return {
      data: {
        email: "",
      },
      message: "Dados inválidos",
    };
  }

  if (typeof password !== "string" || password.length <= 3) {
    return {
      data: {
        email: email,
      },
      message: "Dados inválidos",
    };
  }

  try {
    const user = await authenticatedUser({ email, password });

    await createSessionCookie(user);

    return {
      data: {
        email,
      },
      message: "Login realizado com sucesso.",
    };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : `Error desconhecido: ${error}`;
    return {
      data: {
        email,
      },
      message: "Não foi possível validar usuário.",
      error: msg,
    };
  }
}
