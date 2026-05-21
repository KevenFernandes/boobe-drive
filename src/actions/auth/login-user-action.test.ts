import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { loginService } from "@/src/services/auth/auth-service";
import { createSessionCookie } from "@/src/lib/auth/session";
import { redirect } from "next/navigation";
import { loginAction } from "./login-user-action";

vi.mock("@/src/services/auth/auth-service", () => ({
  loginService: vi.fn(),
}));
vi.mock("@/src/lib/auth/session", () => ({
  createSessionCookie: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("login user action", () => {
  const mockPrevData = {
    success: false,
    data: {
      email: "keven@email.com",
    },
    errors: [],
  };
  const mockFormData = new FormData();

  beforeEach(() => {
    vi.clearAllMocks();

    mockFormData.set("email", "keven@email.com");
    mockFormData.set("password", "keven123");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should return error when formData is not instaceof FormData", async () => {
    const formData = {} as FormData;

    const result = await loginAction(mockPrevData, formData);

    expect(result).toEqual({
      success: false,
      data: { email: "keven@email.com" },
      errors: ["Dados inválidos"],
    });
    expect(loginService).not.toHaveBeenCalled();
    expect(createSessionCookie).not.toHaveBeenCalled();
  });

  test("should return error when validate zod falied", async () => {
    const invalidFormData = new FormData();
    invalidFormData.set("email", "kenve-invalido");
    invalidFormData.set("password", "");

    const result = await loginAction(mockPrevData, invalidFormData);

    expect(result).toEqual({
      success: false,
      data: { email: mockPrevData.data.email },
      errors: ["Email inválido", "A senha deve ter no mínimo 6 caracteres"],
    });
    expect(loginService).not.toHaveBeenCalled();
    expect(createSessionCookie).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  test("should create session cookie and redirect when login is successful", async () => {
    const validFormData = new FormData();
    validFormData.set("email", "keven@email.com");
    validFormData.set("password", "keven123");

    const jwtPayload = { sub: "1", email: "keven@email.com" };
    vi.mocked(loginService).mockResolvedValue(jwtPayload);

    await loginAction(mockPrevData, validFormData);

    expect(loginService).toHaveBeenCalledWith({
      email: "keven@email.com",
      password: "keven123",
    });
    expect(createSessionCookie).toHaveBeenCalledWith(jwtPayload);
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  test("should return an error when the user does not exist", async () => {
    const validFormData = new FormData();
    validFormData.set("email", "keven@email.com");
    validFormData.set("password", "keven123");
    const errorUserNotExist = new Error("Usuário não encontrado");

    vi.mocked(loginService).mockRejectedValue(errorUserNotExist);

    const result = await loginAction(mockPrevData, validFormData);

    expect(result).toEqual({
      success: false,
      data: { email: "keven@email.com" },
      errors: ["Usuário não encontrado"],
    });
    expect(createSessionCookie).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  test("should return an error when the password does not match", async () => {
    const validFormData = new FormData();
    validFormData.set("email", "keven@email.com");
    validFormData.set("password", "wrong-pass");

    vi.mocked(loginService).mockRejectedValue(new Error("Senha incorreta"));

    const result = await loginAction(mockPrevData, validFormData);

    expect(result).toEqual({
      success: false,
      data: { email: "keven@email.com" },
      errors: ["Senha incorreta"],
    });
    expect(createSessionCookie).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
