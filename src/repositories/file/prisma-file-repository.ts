import { IFile, UpdateFileDto } from "@/src/types/file-types";
import { FileRepository } from "./file-repository";
import { prisma } from "@/src/lib/prisma/database";

export class PrismaFileRepository implements FileRepository {
  async findAll(
    page: number,
    limit: number,
    authorId: string,
  ): Promise<IFile[]> {
    const files = await prisma.file.findMany({
      where: { authorId: authorId },
      skip: (page - 1) * limit, //onde começa
      take: limit, //onde termina - quantidade de registro
      orderBy: {
        createdAt: "desc",
      },
    });

    return files;
  }

  async findById(id: string): Promise<IFile | null> {
    const file = await prisma.file.findFirst({ where: { id } });

    return file;
  }

  async findBySlug(slug: string): Promise<IFile | null> {
    const file = await prisma.file.findFirst({ where: { slug } });

    return file;
  }

  async create(file: IFile): Promise<IFile> {
    const fileCreated = await prisma.file.create({ data: file });

    return fileCreated;
  }

  async update(file: UpdateFileDto): Promise<IFile> {
    const fileUpdated = await prisma.file.update({
      where: { id: file.id },
      data: file,
    });

    return fileUpdated;
  }

  async delete(id: string): Promise<IFile> {
    const fileDeleted = await prisma.file.delete({ where: { id } });

    return fileDeleted;
  }
}
