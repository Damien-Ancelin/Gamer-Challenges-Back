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
  role: string,
  username: string,
  jti: string,
};

export interface RefreshToken {
  id: number,
  role: string,
  username: string,
  iat: number,
  exp: number,
  jti: string,
}
