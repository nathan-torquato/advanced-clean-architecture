import { FacebookAPI } from '@/infra/apis'
import { HttpClient } from '@/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAPI', () => {
  const baseUrl = 'https://graph.facebook.com/'
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

  let sut: FacebookAPI
  let httpClient: MockProxy<HttpClient>

  beforeAll(() => {
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new FacebookAPI(httpClient, clientId, clientSecret)
  })

  it('should call loadUser with correct params', async () => {
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
