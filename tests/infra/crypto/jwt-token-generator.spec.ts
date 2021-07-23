import { TokenGenerator } from '@/data/contracts/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expiryInSeconds = params.expirationInMs / 1000

    return jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expiryInSeconds
    })
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator

  const fakeJwt = jwt as jest.Mocked<typeof jwt>

  const secret = 'any_secret'
  const key = 'any_key'
  const expirationInMs = 1000
  const signedToken = 'signed_token'

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret)
    fakeJwt.sign.mockImplementation(() => signedToken)
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({ key, expirationInMs })
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
  })

  it('should return a signed token on success', async () => {
    const result = await sut.generateToken({ key, expirationInMs })
    expect(result).toBe(signedToken)
  })

  it('should throw if sign throws', async () => {
    const error = 'sign_error'
    fakeJwt.sign.mockImplementation(() => { throw new Error(error) })

    const promise = sut.generateToken({ key, expirationInMs })
    await expect(promise).rejects.toThrow(error)
  })
})
