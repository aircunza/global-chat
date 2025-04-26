export interface IAuthUser {
    user: {
      id: string;
      name: string;
      email: string;
    };
    session: {
      accessToken: string;
      expiresAt: string; 
    };
  }
  