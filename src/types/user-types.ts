import {
  CreateUserSchemaTypes,
  UpdateUserSchemaTypes,
} from "../lib/schemas/user-validation";

export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string; // TODO: talvez remover esse campo
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserResponse = {
  email: string;
  name: string;
};

export type CreateUserDto = CreateUserSchemaTypes;
export type UpdateUserDto = UpdateUserSchemaTypes;
