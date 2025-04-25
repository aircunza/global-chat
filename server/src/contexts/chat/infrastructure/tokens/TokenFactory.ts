import { JWToken } from "./JWToken";
import { TokenHandler } from "./TokenHandler";

export class TokenFactory extends TokenHandler {
  createToken(type: string) {
    switch (type) {
      case "JWT":
        return new JWToken();
      case "OAuth":
        throw new Error("Type of token not allowed");
      default:
        return new JWToken();
    }
  }
}
