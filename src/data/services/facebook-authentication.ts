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
    const user = await this.facebookApi.loadUser(params)
    if (!user) {
      return new AuthenticationError()
    }

    const userAccount = await this.userAccountRepo.load({ email: user.email })
    if (!userAccount) {
      await this.userAccountRepo.createFromFacebook(user)
    } else {
      await this.userAccountRepo.updateWithFacebook({
        id: userAccount.id,
        name: userAccount.name ?? user.name,
        facebookId: user.facebookId,
      })
    }
    return new AuthenticationError()
  }
}
