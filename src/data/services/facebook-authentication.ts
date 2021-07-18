import { LoadfacebookUserApi } from '@/data/contracts/apis'
import { CreateUserAccountRepo, LoadUserAccountRepo } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadfacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepo & CreateUserAccountRepo,
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const user = await this.facebookApi.loadUser(params)
    if (!user) {
      return new AuthenticationError()
    }

    await this.userAccountRepo.load({ email: user.email })
    await this.userAccountRepo.createFromFacebook(user)
    return new AuthenticationError()
  }
}
