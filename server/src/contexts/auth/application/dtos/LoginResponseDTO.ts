export interface LoginResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    accessToken: string;
    expiresAt: Date;
  };
}
