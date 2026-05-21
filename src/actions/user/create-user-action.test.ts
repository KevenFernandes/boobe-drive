import { vi, test, describe, beforeEach, expect } from "vitest";
import { hashPassword } from "@/src/lib/bcrypt/hashing-password";
import { createUserService } from "@/src/services/user/user-service";
import { createUserAction } from "./create-user-action";

vi.mock("@/src/lib/bcrypt/hashing-password", () => ({
  hashPassword: vi.fn(),
}));

vi.mock("@/src/services/user/user-service", () => ({
  createUserService: vi.fn(),
}));

describe("create user action", () => {
  const mockInitialState = {
    success: false,
    data: {
      name: "keven",
      email: "keven@email.com",
    },
    errors: [],
    message: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return error when formData is not instaceof FormData", async () => {
    const mockInvalidformData = {} as FormData;
    const result = await createUserAction(
      mockInitialState,
      mockInvalidformData,
    );

    expect(result).toEqual({
      success: false,
      errors: ["Dados inválidos"],
      data: {
        name: "keven",
        email: "keven@email.com",
      },
    });
    expect(hashPassword).not.toHaveBeenCalled();
    expect(createUserService).not.toHaveBeenCalled();
  });

  test("should return an error when validation zod failed", async () => {
    const invalidFormData = new FormData();
    invalidFormData.set("name", "");
    invalidFormData.set("email", "email-invalid");
    invalidFormData.set("password", "abc");

    const result = await createUserAction(mockInitialState, invalidFormData);

    expect(result.success).toBe(false);
    expect(result.data).toEqual({
      name: mockInitialState.data.name,
      email: mockInitialState.data.email,
    });
    expect(result.errors).toEqual([
      "O nome deve ter pelo menos 2 caracteres",
      "Insira um e-mail válido",
      "A senha deve ter no mínimo 6 caracteres",
    ]);
    expect(hashPassword).not.toHaveBeenCalled();
    expect(createUserService).not.toHaveBeenCalled();
  });

  test("should create user with successfully and return email", async () => {
    const validFormData = new FormData();
    validFormData.set("name", "keven");
    validFormData.set("email", "keven@email.com");
    validFormData.set("password", "keven123");

    const mockHash = "hashed_password";
    const mockCreateUser = {
      id: "1",
      name: "keven",
      email: "keven@email.com",
      password: mockHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(hashPassword).mockReturnValue(mockHash);
    vi.mocked(createUserService).mockResolvedValue(mockCreateUser);

    const result = await createUserAction(mockInitialState, validFormData);

    expect(hashPassword).toHaveBeenCalledWith("keven123");
    expect(createUserService).toHaveBeenCalledWith({
      name: "keven",
      email: "keven@email.com",
      password: mockHash,
    });
    expect(result).toEqual({
      success: true,
      data: {
        name: "keven",
        email: "keven@email.com",
      },
      message: "Usuário criado com sucesso",
    });
  });

  test("should return error when exception occurs in the creation service", async () => {
    const validFormData = new FormData();
    validFormData.set("name", "keven");
    validFormData.set("email", "keven@email.com");
    validFormData.set("password", "keven123");

    const mockHash = "hashed_password";

    vi.mocked(hashPassword).mockReturnValue(mockHash);
    vi.mocked(createUserService).mockRejectedValue(
      new Error("Error ao criar conta"),
    );

    const result = await createUserAction(mockInitialState, validFormData);

    expect(hashPassword).toHaveBeenLastCalledWith("keven123");
    expect(createUserService).toHaveBeenCalledWith({
      name: "keven",
      email: "keven@email.com",
      password: mockHash,
    });
    expect(result).toEqual({
      success: false,
      data: {
        name: "keven",
        email: "keven@email.com",
      },
      errors: ["Error ao criar conta"],
    });
  });
});
