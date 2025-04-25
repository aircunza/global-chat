export interface CustomPayload {
  id: string;
  iat: number;
  exp: number;
}
export class TokenHandler {
  static async generateToken(
    payload: CustomPayload
  ): Promise<string | undefined> {
    throw new Error("Not implemented");
  }
  static async staticverifyToken(
    token: string
  ): Promise<CustomPayload | undefined> {
    throw new Error("Not implemented");
  }
}
