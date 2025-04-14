import { JWTToken } from "./JWToken";

export class TokenFactory {
  createToken(type: string) {
    switch (type) {
      case "JWT":
        return new JWTToken();
      case "OAuth":
        throw new Error("Type of token not allowed");
      default:
        return new JWTToken();
    }
  }
}
