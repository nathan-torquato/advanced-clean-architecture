import { RequiredFieldError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'

describe('RequiredStringValidator', () => {
  const fieldName = 'any_field'

  it('should return RequiredFieldError if value is undefined', async () => {
    const sut = new RequiredStringValidator(fieldName, undefined)
    const result = sut.validate()
    expect(result).toEqual(new RequiredFieldError(fieldName))
  })

  it('should return RequiredFieldError if value is null', async () => {
    const sut = new RequiredStringValidator(fieldName, null)
    const result = sut.validate()
    expect(result).toEqual(new RequiredFieldError(fieldName))
  })

  it('should return RequiredFieldError if value is empty string', async () => {
    const sut = new RequiredStringValidator(fieldName, '')
    const result = sut.validate()
    expect(result).toEqual(new RequiredFieldError(fieldName))
  })

  it('should return RequiredFieldError if value is not a string', async () => {
    const sut = new RequiredStringValidator(fieldName, {})
    const result = sut.validate()
    expect(result).toEqual(new RequiredFieldError(fieldName))
  })

  it('should return undefined if value is a non-empty string', async () => {
    const sut = new RequiredStringValidator(fieldName, 'any_value')
    const result = sut.validate()
    expect(result).toEqual(undefined)
  })
})
