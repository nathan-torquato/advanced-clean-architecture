import { RequiredFieldError, ServerError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'
import { FacebookAuthenticationService } from '@/data/services'

export class FacebookLoginController {
  constructor (private readonly facebookAuthService: FacebookAuthenticationService) {}

  async handle (request: any): Promise<HttpResponse> {
    try {
      if (!request.token) {
        return badRequest(new RequiredFieldError('token'))
      }

      const response = await this.facebookAuthService.perform(request)
      if (response instanceof Error) {
        return {
          statusCode: 401,
          data: response
        }
      }

      return {
        statusCode: 200,
        data: {
          accessToken: response.value
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error)
      }
    }
  }
}
