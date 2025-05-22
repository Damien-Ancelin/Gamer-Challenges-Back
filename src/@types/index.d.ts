// * TOKENS TYPES
export interface AccessTokenPayload {
  id: number,
  role: string,
  username: string,
  jti: string,
};

export interface AccessToken {
  id: number,
  role: string,
  username: string,
  jti: string,
  iat: number,
  exp: number,
}

export interface RefreshTokenPayload {
  id: number,
  jti: string,
};

export interface RefreshToken {
  id: number,
  jti: string,
  iat: number,
  exp: number,
}

export type CheckUserError =
{
  statusCode: number;
  success: boolean;
  message?: string;
  validationErrors?: { errorMessage: string }[]
}
