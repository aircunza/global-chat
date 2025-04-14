export class Session {
  private readonly _userId: string;
  private _accessToken: string;
  private _createdAt: Date;
  private _expiresAt: Date;

  constructor(
    userId: string,
    accessToken: string,
    createdAt: Date,
    expiresAt: Date
  ) {
    this._userId = userId;
    this._accessToken = accessToken;
    this._createdAt = createdAt;
    this._expiresAt = expiresAt;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }
}
