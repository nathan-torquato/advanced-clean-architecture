export class AuthenticationError extends Error {
  name = 'AuthenticationError'
  statusCode = 401

  constructor () {
    super('Authentication failed')
  }
}
