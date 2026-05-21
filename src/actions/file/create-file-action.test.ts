import {
  ACCEPT_FILE,
  CreateFileDto,
  MAX_SIZE_FILE,
} from "@/src/types/file-types";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createFileAction } from "./create-file-action";
import { authenticatedUserService } from "@/src/services/auth/auth-service";
import { createFileService } from "@/src/services/file/file-service";

vi.mock("@/src/services/auth/auth-service", () => ({
  authenticatedUserService: vi.fn(),
}));

vi.mock("@/src/services/file/file-service", () => ({
  createFileService: vi.fn(),
}));

/* 
  mockar validacao zod para simular success das validacoes
  assim conseguimos testa validacoes ifs da action
  1 => verificar se arquivo é instancia de File
  2 => verificar se arquivo tem tipagem permitida
  3 => verificar se tamanho do arquivo é permitdo
*/

describe("create file action", () => {
  const mockFile = new File(["imagem-ficticia"], "avatar.png", {
    type: "imagem/png",
  });

  const mockPrevData: CreateFileDto = {
    name: "documento",
    file: mockFile,
    description: "Imagem para perfil",
  };

  let validFormData: FormData;

  beforeEach(() => {
    vi.clearAllMocks();

    validFormData = new FormData();
    validFormData.set("name", "cachoro");
    validFormData.set("file", mockFile);
    validFormData.set("description", "cachorro brincando");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("deve retornar error se formData nao for instaceof de FormData", async () => {
    const invalidFormData = {} as FormData;

    const result = await createFileAction(mockPrevData, invalidFormData);

    expect(result.success).toBe(false);
    expect(result.data).toEqual(mockPrevData);
    expect(result.errors).toContain("Formato de dados inválidos.");
    expect(authenticatedUserService).not.toHaveBeenCalled();
  });

  test("deve retornar error se usuario nao estiver logado", async () => {
    vi.mocked(authenticatedUserService).mockRejectedValue(
      new Error("Usuário não authenticado"),
    );

    const result = await createFileAction(mockPrevData, validFormData);

    expect(result.success).toBe(false);
    expect(result.data).toEqual(mockPrevData);
    expect(result.errors).toContain("Usuário não authenticado");
    expect(createFileService).not.toHaveBeenCalled();
  });

  test("deve retornar error se a validacao do zod falhar", async () => {
    const invalidFormData = new FormData();
    const mockFileInvalid = new File(["file-ficticio"], "invalid.mp4", {
      type: "video/mp4",
    });
    invalidFormData.set("name", "");
    invalidFormData.set("description", "descricao detalhada");
    invalidFormData.set("file", mockFileInvalid);
    invalidFormData.set("folderId", "1");

    const mockUserId = "1";
    vi.mocked(authenticatedUserService).mockResolvedValue(mockUserId);

    const result = await createFileAction(mockPrevData, invalidFormData);

    expect(result.success).toBe(false);
    expect(result.data).toEqual(mockPrevData);
    expect(result.errors).toEqual([
      "O nome do arquivo é obrigatório",
      "Arquivo não suportado",
      "ID da pasta inválido",
    ]);
    expect(createFileService).not.toHaveBeenCalled();
  });

  test("deve retornar zod error se file nao for instaceof de File", async () => {
    const invalidFile = {} as File;

    const formDataInvalidFile = new FormData();
    formDataInvalidFile.set("name", "documento-nome");
    formDataInvalidFile.set("description", "documento invalido");
    formDataInvalidFile.set("file", invalidFile);

    const result = await createFileAction(mockPrevData, formDataInvalidFile);

    expect(result.success).toBe(false);
    expect(result.data).toEqual(mockPrevData);
    expect(result.errors).toContain("Selecione um arquivo válido");
  });

  test("deve retornar zod error se o tipo do file nao for permitido", async () => {
    const invalidFileExt = new File(["conteudo"], "document.exe", {
      type: "application/x-msdownload",
    });
    const formDataInvalidFile = new FormData();
    formDataInvalidFile.set("name", "documento-nome");
    formDataInvalidFile.set("description", "documento invalido");
    formDataInvalidFile.set("file", invalidFileExt);

    const result = await createFileAction(mockPrevData, formDataInvalidFile);

    expect(result.success).toBe(false);
    expect(result.data).toEqual(mockPrevData);
    expect(result.errors).toEqual(["Arquivo não suportado"]);
  });

  test("deve retornar error se o tamanho de file for muito grande", async () => {
    const oversizedFile = new File([""], "foto-pessoa.png", {
      type: ACCEPT_FILE[0],
    });
    Object.defineProperty(oversizedFile, "size", {
      value: MAX_SIZE_FILE + 1,
    });
    const formData = new FormData();
    formData.set("name", "foto-grande");
    formData.set("description", "burlando o tamanho limite");
    formData.set("file", oversizedFile);

    const result = await createFileAction(mockPrevData, formData);

    expect(result.success).toBe(false);
    expect(result.data).toEqual(mockPrevData);
    expect(result.errors).toContain("O tamanho máximo é de 5MB");
  });

  test("deve retornar error se ocorre alguma falha na criacao do file", async () => {
    const validFile = new File(["conteudo"], "doc.pdf", {
      type: ACCEPT_FILE[2],
    });
    const formData = new FormData();
    formData.set("name", "Documento");
    formData.set("description", "Descrição");
    formData.set("file", validFile);

    vi.mocked(createFileService).mockRejectedValue(
      new Error("Falha ao criar arquivo"),
    );

    const result = await createFileAction(mockPrevData, formData);

    expect(createFileService).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.data).toEqual(mockPrevData);
    expect(result.errors).toContain("Falha ao criar arquivo");
  });

  test("deve retornar sucesso se a criacao do file for bem sucedida", async () => {
    const validFile = new File(["conteudo-imagem"], "avatar.png", {
      type: ACCEPT_FILE[2],
    });
    const formData = new FormData();
    formData.set("name", "avatar.png");
    formData.set("description", "Descrição");
    formData.set("file", validFile);

    const mockCreatedFile = {
      id: "12345-dkawjda",
      name: "avatar",
      description: "descricao",
      slug: "avatar-png-458sd",
      urlFile: "./public/image-8ds8d.png",
      size: 1000,
      authorId: "12d5wds5",
      folderId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(createFileService).mockResolvedValue(mockCreatedFile);

    const result = await createFileAction(mockPrevData, formData);

    expect(result.success).toBe(true);
    expect(result.message).toEqual("Arquivo salvo com sucesso");
    expect(result.data).toEqual({
      id: mockCreatedFile.id,
      name: mockCreatedFile.name,
      description: mockCreatedFile.description,
      slug: mockCreatedFile.slug,
      urlFile: mockCreatedFile.urlFile,
      size: mockCreatedFile.size,
      authorId: mockCreatedFile.authorId,
      folderId: mockCreatedFile.folderId,
      createdAt: mockCreatedFile.createdAt,
      updatedAt: mockCreatedFile.updatedAt,
    });
  });
});
