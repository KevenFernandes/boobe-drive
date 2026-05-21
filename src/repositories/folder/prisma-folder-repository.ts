import {
  IFolder,
  CreateFolderDto,
  UpdateFolderDto,
} from "@/src/types/folder-types";
import { FolderRepository } from "./folder-repository";
import { prisma } from "@/src/lib/prisma/database";

export class PrismaFolderRepository implements FolderRepository {
  async findById(id: string): Promise<IFolder> {
    // limite máxima de 10 pastas - fazer no service
    const folder = await prisma.folder.findFirst({ where: { id } });

    if (!folder) throw new Error("Folder não encontrado com id fornecido");

    return folder;
  }

  async findAllByUserId(
    userId: string,
    start: number = 1,
    limit: number = 10,
  ): Promise<IFolder[] | null> {
    const folders = await prisma.folder.findMany({
      where: { userId },
      skip: (start - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return folders;
  }
  async create(data: CreateFolderDto): Promise<IFolder> {
    throw new Error("Method not implemented.");
  }
  async update(data: UpdateFolderDto): Promise<IFolder> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
