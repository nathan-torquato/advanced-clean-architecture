import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { FacebookAuthenticationService } from '@/data/services'

export class FacebookLoginController {
  constructor (private readonly facebookAuthService: FacebookAuthenticationService) {}

  async handle (request: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (!request.token) {
        return badRequest(new RequiredFieldError('token'))
      }

      const response = await this.facebookAuthService.perform(request)
      if (response instanceof Error) {
        return unauthorized()
      }

      return ok({
        accessToken: response.value
      })
    } catch (error) {
      return serverError(error)
    }
  }
}

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}
