import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { LoadUserAccountRepo, SaveFacebookAccountRepo } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepo & SaveFacebookAccountRepo>
  let crypto: MockProxy<TokenGenerator>
  let token: string

  beforeAll(() => {
    token = 'token'

    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebookData.mockResolvedValue({ id: 'any_account_id' })

    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_token')
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo, crypto)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should return AuthenticationError when LoadFacebookUserApi finds no user', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const result = await sut.perform({ token })
    expect(result).toEqual(new AuthenticationError())
  })

  it('should call LoaduserAccountRepo when LoadFacebookUserApi finds a user', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
  })

  it('should call SaveWithFacebookData instance of FacebookAccount', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebookData).toHaveBeenCalledWith(expect.any(FacebookAccount))
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
  })

  it('should return an AccessToken on success', async () => {
    const result = await sut.perform({ token })
    expect(result).toBeInstanceOf(AccessToken)
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebookData.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
