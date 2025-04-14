// user.dto.ts
interface IUserDto {
  id: string;
  name: string;
  email: string;
}
export class UserDTO {
  id: string;
  name: string;
  email: string;

  constructor({ id, name, email }: IUserDto) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static fromEntity(user: IUserDto): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
