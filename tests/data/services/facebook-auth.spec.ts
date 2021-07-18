import { LoadfacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthService', () => {
  let sut: FacebookAuthenticationService
  let loadfacebookUserApi: MockProxy<LoadfacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepo>

  const token = 'token'

  beforeEach(() => {
    jest.clearAllMocks()

    loadfacebookUserApi = mock<LoadfacebookUserApi>()
    loadfacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    loadUserAccountRepo = mock<LoadUserAccountRepo>()

    sut = new FacebookAuthenticationService(loadfacebookUserApi, loadUserAccountRepo)
  })

  it('should call LoadfacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadfacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    expect(loadfacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should return AuthenticationError when LoadfacebookUserApi returns undefined', async () => {
    loadfacebookUserApi.loadUser.mockResolvedValue(undefined)

    const result = await sut.perform({ token })
    expect(result).toEqual(new AuthenticationError())
  })

  it('should call LoaduserAccountRepo when LoadfacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
  })
})
