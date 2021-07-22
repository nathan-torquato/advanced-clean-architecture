import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

export interface HttpClient {
  get: <T = any>(params: HttpClient.Params) => Promise<T>
}

export namespace HttpClient {
  export type Params = {
    url: string
  }
}

export class FacebookAPI {
  private readonly baseUrl = 'https://graph.facebook.com/'

  constructor (private readonly httpClient: HttpClient) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}oauth/access_token`
    })
  }
}

describe('FacebookAPI', () => {
  const baseUrl = 'https://graph.facebook.com/'

  it('should loadUser to get app token', async () => {
    const httpClient = mock<HttpClient>()
    const sut = new FacebookAPI(httpClient)
    await sut.loadUser({ token: 'any_cient_token' })
    expect(httpClient.get).toHaveBeenCalledTimes(1)
    expect(httpClient.get).toHaveBeenCalledWith({
      url: `${baseUrl}oauth/access_token`
    })
  })
})
