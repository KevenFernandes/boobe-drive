import { CreateFolderSchemaTypes } from "../lib/schemas/folder-validation";

export interface IFolder {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateFolderDto = CreateFolderSchemaTypes;
export type UpdateFolderDto = {
  name: string;
};
