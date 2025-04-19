import { JwtPayload } from "jsonwebtoken";

import { TokenFactory } from "./TokenFactory";

export async function verifyAuthToken(token: string): Promise<JwtPayload> {
  try {
    const tokenFactory = new TokenFactory();
    const tokenHandler = tokenFactory.createToken("JWT");
    const payload = (await tokenHandler.verifyToken(token)) as JwtPayload;
    return payload;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
