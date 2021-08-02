import { RequiredFieldError } from '@/application/errors'
import { Validator } from '@/application/validation/validator'

export class RequiredStringValidator implements Validator {
  constructor (readonly fieldName: string, readonly value: any) {}

  validate (): RequiredFieldError | undefined {
    if (typeof this.value !== 'string' || !this.value.length) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
