import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

export interface HttpClient {
  get: <T = any, U = any>(params: HttpClient.Params<U>) => Promise<T>
}

export namespace HttpClient {
  export type Params<U> = {
    url: string
    params?: U
  }
}

export class FacebookAPI {
  private readonly baseUrl = 'https://graph.facebook.com/'

  constructor (
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}

describe('FacebookAPI', () => {
  const baseUrl = 'https://graph.facebook.com/'
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

  it('should call loadUser with correct params', async () => {
    const httpClient = mock<HttpClient>()
    const sut = new FacebookAPI(httpClient, clientId, clientSecret)
    await sut.loadUser({ token: 'any_cient_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: `${baseUrl}oauth/access_token`,
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
    expect(httpClient.get).toHaveBeenCalledTimes(1)
  })
})
