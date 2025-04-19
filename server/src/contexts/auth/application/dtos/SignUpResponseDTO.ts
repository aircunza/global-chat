interface IUserDto {
  id: string;
  name: string;
  email: string;
}
export class SignUpResponseDTO {
  id: string;
  name: string;
  email: string;

  constructor({ id, name, email }: IUserDto) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static fromEntity(user: IUserDto): SignUpResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
