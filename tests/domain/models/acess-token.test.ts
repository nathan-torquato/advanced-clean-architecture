import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  it('should be create with a value', async () => {
    const value = 'any_value'
    const sut = new AccessToken(value)
    expect(sut.value).toEqual(value)
  })

  it('should expire in 30min', async () => {
    const sut = new AccessToken('any_value')
    expect(sut.expirationInMs).toBe(30 * 60 * 1000)
  })
})
