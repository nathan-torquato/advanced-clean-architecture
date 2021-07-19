import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo, SaveFacebookAccountRepo } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepo & SaveFacebookAccountRepo,
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUser = await this.facebookApi.loadUser(params)
    if (!facebookUser) {
      return new AuthenticationError()
    }

    const userAccount = await this.userAccountRepo.load({ email: facebookUser.email })
    await this.userAccountRepo.saveWithFacebookData({
      id: userAccount?.id,
      name: userAccount?.name ?? facebookUser.name,
      email: facebookUser.email,
      facebookId: facebookUser.facebookId,
    })

    return new AuthenticationError()
  }
}
