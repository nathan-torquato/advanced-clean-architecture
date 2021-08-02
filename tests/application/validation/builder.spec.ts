import { RequiredStringValidator, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder
      .of({ fieldName: 'any_name', value: 'any_value' })
      .requiredString()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_name', 'any_value')])
  })
})
