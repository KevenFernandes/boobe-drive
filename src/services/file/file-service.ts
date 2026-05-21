import { CreateFileDto, IFile, UpdateFileDto } from "@/src/types/file-types";
import { generateFileName, generateSlug } from "@/src/utils/sanitize-names";
import path from "node:path";
import fs from "fs/promises";
import { fileRepository } from "@/src/repositories/file";

export async function createFileService(data: CreateFileDto, userId: string) {
  const file = data.file;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = generateFileName(file.name);
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  await fs.writeFile(filePath, buffer);

  const fileObj: IFile = {
    name: data.name,
    description: data.description ?? null,
    slug: generateSlug(data.name),
    urlFile: filePath,
    size: file.size,
    authorId: userId,
    folderId: data.folderId ?? null,
  };

  const newFile = await fileRepository.create(fileObj);

  if (!newFile) throw new Error("Falha ao criar arquivo");

  return newFile;
}

export async function updateFileService(data: UpdateFileDto) {
  const updatedFile = await fileRepository.update(data);

  if (!updatedFile) throw new Error("Falha ao atualizar arquivo");

  return updatedFile;
}
