import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { LoadUserAccountRepo, SaveFacebookAccountRepo } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken, FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepo & SaveFacebookAccountRepo,
    private readonly crypto: TokenGenerator,
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUser = await this.facebookApi.loadUser(params)
    if (!facebookUser) {
      return new AuthenticationError()
    }

    const userAccount = await this.userAccountRepo.load({ email: facebookUser.email })
    const facebookAccount = new FacebookAccount(facebookUser, userAccount)
    const { id } = await this.userAccountRepo.saveWithFacebookData(facebookAccount)
    const token = await this.crypto.generateToken({
      key: id, expirationInMs: AccessToken.expirationInMs
    })

    return new AccessToken(token)
  }
}
