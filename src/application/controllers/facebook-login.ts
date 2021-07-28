import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'
import { FacebookAuthenticationService } from '@/data/services'

export class FacebookLoginController {
  constructor (private readonly facebookAuthService: FacebookAuthenticationService) {}

  async handle (request: HttpRequest): Promise<HttpResponse<Model>> {
    const error = this.validate(request)
    if (error) {
      return badRequest(error)
    }

    try {
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

  private validate (httpRequest: HttpRequest): Error | undefined {
    const validator = new RequiredStringValidator('token', httpRequest.token)
    return validator.validate()
  }
}

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}
