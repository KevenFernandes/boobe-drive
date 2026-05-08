import { LoginUserSchemaTypes } from "../lib/schemas/auth-validation";

export type JWTPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type LoginUserDto = LoginUserSchemaTypes;
