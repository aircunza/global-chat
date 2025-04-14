import { Session } from "../../domain/entity/Session";
import { IAuthRepository } from "../../domain/repository/IAuthRepository.rp";
import { TokenFactory } from "../../infrastructure/tokens/TokenFactory";
import { LoginResponseDTO } from "../dtos/LoginResponseDTO";

export class LoginService {
  constructor(private readonly repository: IAuthRepository) {}
  async run({ email, password }: { email: string; password: string }) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.password !== password) throw new Error("Password incorrect");
    const tokenFactory = new TokenFactory();
    const tokenHandler = tokenFactory.createToken("JWT");
    const token = (await tokenHandler.generateToken({ id: user.id })) || "";

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);
    const session = new Session(user.id, token, new Date(), expiresAt);

    // Convert to DTO to return clean data
    const loginResponse: LoginResponseDTO = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      session: {
        accessToken: session.accessToken,
        expiresAt: session.expiresAt,
      },
    };

    return loginResponse;
  }
}
