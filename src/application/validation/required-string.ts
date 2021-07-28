import { RequiredFieldError } from '@/application/errors'

export class RequiredStringValidator {
  constructor (readonly fieldName: string, readonly value: any) {}

  validate (): RequiredFieldError | undefined {
    if (typeof this.value !== 'string' || !this.value.length) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
