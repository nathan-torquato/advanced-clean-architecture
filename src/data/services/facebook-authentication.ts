import { LoadfacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly loadfacebookUserApi: LoadfacebookUserApi) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    await this.loadfacebookUserApi.loadUser(params)
    return new AuthenticationError()
  }
}
