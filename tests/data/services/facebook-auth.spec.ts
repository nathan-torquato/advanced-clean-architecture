import { LoadfacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthService', () => {
  let sut: FacebookAuthenticationService
  let loadfacebookUserApi: MockProxy<LoadfacebookUserApi>

  const token = 'token'

  beforeEach(() => {
    jest.clearAllMocks()
    loadfacebookUserApi = mock<LoadfacebookUserApi>()
    sut = new FacebookAuthenticationService(loadfacebookUserApi)
  })

  it('should call LoadfacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadfacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    expect(loadfacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should return AuthenticationError when LoadfacebookUserApi returns undefined', async () => {
    loadfacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const result = await sut.perform({ token })
    expect(result).toEqual(new AuthenticationError())
  })
})
