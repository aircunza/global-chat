import { Session } from "../../domain/entity/Session";
import { TokenFactory } from "../../infrastructure/tokens/TokenFactory";
import { LoginResponseDTO } from "../dtos/LoginResponseDTO";
import { FindUserById } from "../useCases/FindUserById";

export class VerifyService {
  constructor(private readonly useCase: FindUserById) {}
  async run(token: string) {
    const tokenFactory = new TokenFactory();
    const tokenHandler = tokenFactory.createToken("JWT");
    const user = await tokenHandler.verifyToken(token);
    if (!user) return;
    const userFound = await this.useCase.run(user.id);
    if (!userFound) {
      throw new Error("User not found");
    }

    // Set session:
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);
    const session = new Session(user.id, token, new Date(), expiresAt);

    // Convert to DTO to return clean data
    const verifyResponse: LoginResponseDTO = {
      user: {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
      },
      session: {
        accessToken: session.accessToken,
        expiresAt: session.expiresAt,
      },
    };

    return verifyResponse;
  }
}
