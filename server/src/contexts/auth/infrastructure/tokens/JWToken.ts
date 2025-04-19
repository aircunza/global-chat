import jwt, { JwtPayload } from "jsonwebtoken";

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
    try {
      const token = await jwt.sign(payload, this.secretKey, {
        expiresIn: "24h",
      });
      const decoded = jwt.decode(token) as JwtPayload;
      return { token, exp: decoded.exp, iat: decoded.iat };
    } catch (e) {
      return null;
    }
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
