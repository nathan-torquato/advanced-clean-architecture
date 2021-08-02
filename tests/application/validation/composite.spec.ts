import { ValidationComposite, Validator } from '@/application/validation'
import { mock } from 'jest-mock-extended'

describe('ValidationComposite', () => {
  let sut: ValidationComposite

  const validator1 = mock<Validator>()
  const validator2 = mock<Validator>()
  const validators = [validator1, validator2]

  beforeEach(() => {
    validator1.validate.mockReturnValue(undefined)
    validator2.validate.mockReturnValue(undefined)
    sut = new ValidationComposite(validators)
  })

  it('should call validator.validate', async () => {
    sut.validate()

    expect(validator1.validate).toHaveBeenCalledTimes(1)
  })

  it('should return undefined if all validators return undefined', async () => {
    const errors = sut.validate()

    expect(errors).toBeUndefined()
  })

  it('should return the first error', async () => {
    const error1 = new Error('validation_error_1')
    validator1.validate.mockReturnValueOnce(error1)

    const errors = sut.validate()

    expect(errors).toBe(error1)
    expect(validator2.validate).toHaveBeenCalledTimes(0)
  })
})
