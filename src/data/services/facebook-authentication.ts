import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo, SaveFacebookAccountRepo } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepo & SaveFacebookAccountRepo,
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUser = await this.facebookApi.loadUser(params)
    if (facebookUser) {
      const userAccount = await this.userAccountRepo.load({ email: facebookUser.email })
      const facebookAccount = new FacebookAccount(facebookUser, userAccount)
      await this.userAccountRepo.saveWithFacebookData(facebookAccount)
    }

    return new AuthenticationError()
  }
}
