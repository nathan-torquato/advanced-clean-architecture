import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo, SaveFacebookAccountRepo } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepo & SaveFacebookAccountRepo>

  const token = 'token'
  const facebookUserMock = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  beforeEach(() => {
    jest.clearAllMocks()

    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue(facebookUserMock)

    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)

    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should return AuthenticationError when LoadFacebookUserApi finds no user', async () => {
    facebookApi.loadUser.mockResolvedValue(undefined)

    const result = await sut.perform({ token })
    expect(result).toEqual(new AuthenticationError())
  })

  it('should call LoaduserAccountRepo when LoadFacebookUserApi finds a user', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
  })

  it('should create account with facebook data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebookData).toHaveBeenCalledWith(facebookUserMock)
    expect(userAccountRepo.saveWithFacebookData).toHaveBeenCalledTimes(1)
  })

  it('should not update account name', async () => {
    userAccountRepo.load.mockResolvedValue({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebookData).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.saveWithFacebookData).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    })
  })

  it('should update account name', async () => {
    userAccountRepo.load.mockResolvedValue({
      id: 'any_id',
    })

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebookData).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.saveWithFacebookData).toHaveBeenCalledWith({
      id: 'any_id',
      ...facebookUserMock
    })
  })
})
