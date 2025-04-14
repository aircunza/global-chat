import jwt from "jsonwebtoken";

import { configApps } from "../../../../apps/config";
import {
  AuthTokenPayload,
  TokenHandler,
} from "../../domain/entity/TokenHandler";

export class JWTToken extends TokenHandler {
  private readonly secretKey: string;
  constructor() {
    super();
    this.secretKey = configApps.jwtSecret;
  }

  async generateToken(payload: AuthTokenPayload) {
    const result = await jwt.sign(payload, this.secretKey, {
      expiresIn: "8h",
    });
    return result;
  }
  async verifyToken(token: string): Promise<AuthTokenPayload | undefined> {
    try {
      const result = await jwt.verify(token, this.secretKey);
      return result as AuthTokenPayload;
    } catch (e) {
      throw new Error("Invalid Token");
    }
  }
}
