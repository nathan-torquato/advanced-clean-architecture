const MINUTES = 60
const MILLISECONDS = 1000

export class AccessToken {
  static readonly expirationInMs = 30 * MINUTES * MILLISECONDS

  constructor (readonly value: string) {}
}
