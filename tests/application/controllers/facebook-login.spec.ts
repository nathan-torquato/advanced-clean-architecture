import { FacebookLoginController } from '@/application/controllers'
import { RequiredFieldError, ServerError } from '@/application/errors'
import { HttpResponse } from '@/application/helpers'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { mock } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  const fakeFacebookAuth = mock<FacebookAuthenticationService>()

  const token = 'any_token'

  beforeEach(() => {
    sut = new FacebookLoginController(fakeFacebookAuth)
    fakeFacebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
  })

  it('should return 400 if token is empty', async () => {
    const response = await sut.handle({ token: '' })
    expect(response).toEqual<HttpResponse>({
      statusCode: 400,
      data: new RequiredFieldError('token')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const response = await sut.handle({ token: undefined })
    expect(response).toEqual<HttpResponse>({
      statusCode: 400,
      data: new RequiredFieldError('token')
    })
  })

  it('should return 400 if token is null', async () => {
    const response = await sut.handle({ token: null })
    expect(response).toEqual<HttpResponse>({
      statusCode: 400,
      data: new RequiredFieldError('token')
    })
  })

  it('should call FacebookAuthenticationService with correct params', async () => {
    await sut.handle({ token })

    expect(fakeFacebookAuth.perform).toHaveBeenCalledTimes(1)
    expect(fakeFacebookAuth.perform).toHaveBeenCalledWith({
      token
    })
  })

  it('should return 401 if authentication fails', async () => {
    fakeFacebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const response = await sut.handle({ token })
    expect(response).toEqual<HttpResponse>({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })

  it('should return 200 on success', async () => {
    const response = await sut.handle({ token })
    expect(response).toEqual<HttpResponse>({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    fakeFacebookAuth.perform.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
