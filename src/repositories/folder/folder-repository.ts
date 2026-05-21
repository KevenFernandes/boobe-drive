import {
  CreateFolderDto,
  IFolder,
  UpdateFolderDto,
} from "@/src/types/folder-types";

export interface FolderRepository {
  findById(id: string): Promise<IFolder>;
  findAllByUserId(
    userId: string,
    start: number,
    limit: number,
  ): Promise<IFolder[] | null>;

  create(data: CreateFolderDto): Promise<IFolder>;
  update(data: UpdateFolderDto): Promise<IFolder>;
  delete(id: string): Promise<void>;
}
