import { FacebookAccount } from '@/domain/models'

describe('FacebookAccount', () => {
  const facebookUser = {
    name: 'fb-name',
    email: 'fb-email',
    facebookId: 'fb-facebookId',
  }

  it('should create with facebook data only', async () => {
    const sut = new FacebookAccount(facebookUser)
    expect(sut).toEqual(facebookUser)
  })

  it('should update name if it is empty', async () => {
    const userAccount = { id: 'any-id' }
    const sut = new FacebookAccount(facebookUser, userAccount)

    expect(sut).toEqual({ ...facebookUser, ...userAccount })
  })

  it('should not update name if it is not empty', async () => {
    const userAccount = { id: 'any-id', name: 'any-name' }
    const sut = new FacebookAccount(facebookUser, userAccount)

    expect(sut).toEqual({ ...facebookUser, ...userAccount })
  })
})
