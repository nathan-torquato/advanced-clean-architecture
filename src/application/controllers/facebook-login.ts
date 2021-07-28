import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse, serverError, unauthorized } from '@/application/helpers'
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
        return unauthorized()
      }

      return {
        statusCode: 200,
        data: {
          accessToken: response.value
        }
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
