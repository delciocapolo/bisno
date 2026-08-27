export type VerificationCodeTypes =
  | "login"
  | "password_reset"
  | "phone_verification"
  | "email_verification"
  | "identity_verification"
  | "transaction_confirmation";

export class VerificationCode {
  constructor(
    public readonly id: string,
    public readonly mixeiroId: string,
    public readonly type: VerificationCodeTypes,
    public _expiresAt: Date,
    public _code: string,
    public _usedAt: Date | null,
  ) {}

  public get hasExpired(): boolean {
    return Date.now() >= new Date(this._expiresAt).getTime();
  }

  public useCode(): void {
    if (this.hasExpired) {
      throw new Error(`Code have been expired`);
    }
    this._usedAt = new Date();
  }

  public get currentCode(): string {
    return this._code;
  }
}
