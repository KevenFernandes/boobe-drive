import { vi, test, describe, beforeEach, afterEach, expect } from "vitest";
import { updateUserSchema } from "@/src/lib/schemas/user-validation";
import { authenticatedUserService } from "@/src/services/auth/auth-service";
import { updateUserService } from "@/src/services/user/user-service";
import { updateUserAction } from "./update-user-action";
import { IUser } from "@/src/types/user-types";

vi.mock("@/src/lib/schemas/user-validation", () => ({
  updateUserSchema: {
    safeParse: vi.fn(),
  },
}));

vi.mock("@/src/services/auth/auth-service", () => ({
  authenticatedUserService: vi.fn(),
}));

vi.mock("@/src/services/user/user-service", () => ({
  updateUserService: vi.fn(),
}));

describe("update user action", () => {
  // TODO: criar att para password
  const mockPrevData = {
    name: "keven",
    email: "keven@email.com",
  };

  const mockFormData = new FormData();

  beforeEach(() => {
    vi.clearAllMocks();

    mockFormData.set("name", "keven1");
    mockFormData.set("email", "keven1@email.com");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should return error when formData is not instanceof FormData", async () => {
    const invalidFormData = {} as FormData;

    const result = await updateUserAction(mockPrevData, invalidFormData);

    expect(result).toEqual({
      success: false,
      data: mockPrevData,
      errors: ["Dados inválidos"],
    });
    expect(authenticatedUserService).not.toHaveBeenCalled();
    expect(updateUserSchema.safeParse).not.toHaveBeenCalled();
    expect(updateUserService).not.toHaveBeenCalled();
  });

  test("should return error when validated zod is failed", async () => {
    const mockZodError = {
      flatten: () => ({
        fieldErrors: { email: ["Email inválido"] },
        formErrors: [],
      }),
    };

    vi.mocked(updateUserSchema.safeParse).mockReturnValue({
      success: false,
      error: mockZodError,
    } as unknown as ReturnType<typeof updateUserSchema.safeParse>);

    const result = await updateUserAction(mockPrevData, mockFormData);

    expect(result.success).toBe(false);
    expect(result.data).toEqual(mockPrevData);
    expect(result.errors).toContain("Email inválido");
    expect(updateUserService).not.toHaveBeenCalled();
  });

  test("should return error when user is not authenticated", async () => {
    const msgError = "Usuário não autenticado";
    const mockError = new Error(msgError);

    vi.mocked(authenticatedUserService).mockRejectedValue(mockError);

    const result = await updateUserAction(mockPrevData, mockFormData);

    expect(updateUserSchema.safeParse).not.toHaveBeenCalled();
    expect(updateUserService).not.toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      data: mockPrevData,
      errors: [msgError],
    });
  });

  test("should return user when updated successfully", async () => {
    const mockValidFormData = { name: "keven1", email: "keven1@email.com" };
    const mockUserId = "1";
    const mockUser: IUser = {
      id: "1",
      name: "keven1",
      email: "keven1@email.com",
      password: "hash_password", //acho que nao deveria retornar a senha
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // funcao async => usar resolved
    vi.mocked(authenticatedUserService).mockResolvedValue(mockUserId);
    // funcao normal => usar return
    vi.mocked(updateUserSchema.safeParse).mockReturnValue({
      success: true,
      data: mockValidFormData,
    });
    vi.mocked(updateUserService).mockResolvedValue(mockUser);

    const result = await updateUserAction(mockPrevData, mockFormData);

    expect(authenticatedUserService).toHaveResolvedWith(mockUserId);
    expect(updateUserSchema.safeParse).toHaveBeenCalledWith(mockValidFormData);
    expect(updateUserService).toHaveBeenCalledWith(
      mockValidFormData,
      mockUserId,
    );
    expect(updateUserService).toHaveResolvedWith(mockUser);
    expect(result).toEqual({
      data: mockUser,
      success: true,
      message: "Usuário atualizado com sucesso",
    });
  });

  test("should return error when updated user failed", async () => {
    const mockValidForm = { name: "keven1", email: "keven1@email.com" };
    const mockUserId = "1";
    const erroMessage = "Falha ao atualizar usuário";
    const mockError = new Error(erroMessage);

    vi.mocked(authenticatedUserService).mockResolvedValue(mockUserId);
    vi.mocked(updateUserSchema.safeParse).mockReturnValue({
      success: true,
      data: mockValidForm,
    });
    vi.mocked(updateUserService).mockRejectedValue(mockError);

    const result = await updateUserAction(mockPrevData, mockFormData);

    expect(result).toEqual({
      data: mockPrevData,
      success: false,
      errors: [erroMessage],
    });
    expect(authenticatedUserService).toHaveBeenCalled();
    expect(authenticatedUserService).toHaveResolvedWith(mockUserId);
    expect(updateUserSchema.safeParse).toHaveBeenCalledWith(mockValidForm);
    expect(updateUserService).toHaveBeenCalledWith(mockValidForm, mockUserId);
  });
});
