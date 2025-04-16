import { User } from "../../domain/entity/User";
import { SignUpResponseDTO } from "../dtos/SignUpResponseDTO";
import { FindUserByEmail } from "../useCases/FindUserByEmail";
import { FindUserById } from "../useCases/FindUserById";
import { SaveUser } from "../useCases/SaveUser";

export class SignUpService {
  constructor(
    private readonly saveUserUC: SaveUser,
    private readonly findUserByEmailUC: FindUserByEmail,
    private readonly findUserByIdUC: FindUserById
  ) {}
  async run(user: User) {
    const userFoundByEmail = await this.findUserByEmailUC.run(user.email);
    if (userFoundByEmail !== null) {
      throw new Error("Email already in use");
    }
    const userFoundById = await this.findUserByIdUC.run(user.id);
    if (userFoundById !== null) throw new Error("User already exists");
    const newUser = await this.saveUserUC.run(user);
    const result = SignUpResponseDTO.fromEntity(newUser);
    return result;
  }
}
