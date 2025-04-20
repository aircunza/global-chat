export interface ILoginResponse {
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
  