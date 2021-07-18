import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepo, LoadUserAccountRepo, UpdateFacebookAccountRepo } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthService', () => {
  let sut: FacebookAuthenticationService
  let acebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepo & CreateFacebookAccountRepo & UpdateFacebookAccountRepo>

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

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(acebookApi.loadUser).toHaveBeenCalledTimes(1)
    expect(acebookApi.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should return AuthenticationError when LoadFacebookUserApi finds no user', async () => {
    acebookApi.loadUser.mockResolvedValue(undefined)

    const result = await sut.perform({ token })
    expect(result).toEqual(new AuthenticationError())
  })

  it('should call LoaduserAccountRepo when LoadFacebookUserApi finds a user', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
  })

  it('should call CreateFacebookAccountRepo when LoadFacebookUserApi finds no user', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith(facebookUserMock)
  })

  it('should call UpdateFacebookAccountRepo when LoadFacebookUserApi finds a user', async () => {
    userAccountRepo.load.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id',
    })
  })

  it('should update user name when LoadFacebookUserApi finds a user without a name', async () => {
    userAccountRepo.load.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
    })

    await sut.perform({ token })

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    })
  })
})
