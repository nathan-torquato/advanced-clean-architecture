import { LoadfacebookUserApi } from '@/data/contracts/apis'
import { CreateUserAccountRepo, LoadUserAccountRepo } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthService', () => {
  let sut: FacebookAuthenticationService
  let acebookApi: MockProxy<LoadfacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepo & CreateUserAccountRepo>

  const token = 'token'
  const facebookUserMock = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  beforeEach(() => {
    jest.clearAllMocks()

    acebookApi = mock()
    acebookApi.loadUser.mockResolvedValue(facebookUserMock)

    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)

    sut = new FacebookAuthenticationService(acebookApi, userAccountRepo)
  })

  it('should call LoadfacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(acebookApi.loadUser).toHaveBeenCalledTimes(1)
    expect(acebookApi.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should return AuthenticationError when LoadfacebookUserApi finds no user', async () => {
    acebookApi.loadUser.mockResolvedValue(undefined)

    const result = await sut.perform({ token })
    expect(result).toEqual(new AuthenticationError())
  })

  it('should call LoaduserAccountRepo when LoadfacebookUserApi finds a user', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
  })

  it('should call CreateUserAccountRepo when LoadfacebookUserApi finds no user', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith(facebookUserMock)
  })
})
