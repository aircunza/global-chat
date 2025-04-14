export interface AuthTokenPayload {
  id: string;
}

export interface ITokenHandler {
  generateToken(payload: AuthTokenPayload): string | void;
  verifyToken(token: string): AuthTokenPayload | void;
}

export class TokenHandler implements ITokenHandler {
  generateToken(payload: AuthTokenPayload) {
    throw new Error(`Method not implemented for ${payload} `);
  }
  verifyToken(token: string) {
    throw new Error(`Method not implemented for ${token}`);
  }
}
