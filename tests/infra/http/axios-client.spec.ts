import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

export class AxiosHttpClient {
  async get <T>({ url, params }: HttpGetClient.Params): Promise<T> {
    const response = await axios.get<T>(url, { params })
    return response.data
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient

  const fakeAxios = axios as jest.Mocked<typeof axios>
  const url = 'any'
  const params = { any: 'param' }
  const successData = 'any_data'

  beforeEach(() => {
    sut = new AxiosHttpClient()
    fakeAxios.get.mockResolvedValue({
      data: successData
    })
  })

  it('should call get with correct params', async () => {
    await sut.get({ url, params })

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
    expect(fakeAxios.get).toHaveBeenCalledTimes(1)
  })

  it('should return data on success', async () => {
    const result = await sut.get({ url, params })

    expect(result).toBe(successData)
  })
})
