import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { HttpResponse } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { mock } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

jest.mock('@/application/validation/required-string')

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  const fakeFacebookAuth = mock<FacebookAuthenticationService>()

  const token = 'any_token'

  beforeEach(() => {
    sut = new FacebookLoginController(fakeFacebookAuth)
    fakeFacebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
  })

  it('should return call validation with correct params', async () => {
    await sut.handle({ token })

    expect(RequiredStringValidator).toHaveBeenCalledWith('token', 'any_token')
    expect(RequiredStringValidator).toHaveBeenCalledTimes(1)
  })

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy)

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
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
      data: new UnauthorizedError()
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
