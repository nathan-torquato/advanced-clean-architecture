import { LoadfacebookUserApi } from '@/data/contracts/apis'
import { CreateUserAccountRepo, LoadUserAccountRepo } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly loadfacebookUserApi: LoadfacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepo,
    private readonly createUserAccountRepo: CreateUserAccountRepo,
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const user = await this.loadfacebookUserApi.loadUser(params)
    if (!user) {
      return new AuthenticationError()
    }

    await this.loadUserAccountRepo.load({ email: user.email })
    await this.createUserAccountRepo.createFromFacebook(user)
    return new AuthenticationError()
  }
}
