import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepo, LoadUserAccountRepo, UpdateFacebookAccountRepo } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepo & CreateFacebookAccountRepo & UpdateFacebookAccountRepo,
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUser = await this.facebookApi.loadUser(params)
    if (!facebookUser) {
      return new AuthenticationError()
    }

    const userAccount = await this.userAccountRepo.load({ email: facebookUser.email })
    if (!userAccount) {
      await this.userAccountRepo.createFromFacebook(facebookUser)
    } else {
      await this.userAccountRepo.updateWithFacebook({
        id: userAccount.id,
        name: userAccount.name ?? facebookUser.name,
        facebookId: facebookUser.facebookId,
      })
    }
    return new AuthenticationError()
  }
}
