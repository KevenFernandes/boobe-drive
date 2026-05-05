export type JWTPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};
