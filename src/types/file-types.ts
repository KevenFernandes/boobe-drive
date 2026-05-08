import {
  CreateFileSchemaTypes,
  UpdateFileSchemaTypes,
} from "../lib/schemas/file-validation";

export interface IFile {
  id?: string;
  name: string;
  description: string | null;
  slug: string; //obter o caminho da pagina
  urlFile: string; //obter a imagem que está na pasta public
  size: number;
  authorId: string;
  folderId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateFileDto = CreateFileSchemaTypes;
export type UpdateFileDto = UpdateFileSchemaTypes; //file aparece aqui ao passar o mouse em cuma, mas na implementacao nao aparece

export const MAX_SIZE_FILE = 5 * 1024 * 1024;
export const ACCEPT_FILE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
