import { IFile, UpdateFileDto } from "@/src/types/file-types";

export interface FileRepository {
  findAll(page: number, limit: number, authorId: string): Promise<IFile[]>;
  findById(id: string): Promise<IFile | null>; //IFile ou null
  findBySlug(slug: string): Promise<IFile | null>; //IFile ou null

  create(file: IFile): Promise<IFile>;
  update(file: UpdateFileDto): Promise<IFile>;
  delete(id: string): Promise<IFile>;
}
