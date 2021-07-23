import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

export class AxiosHttpClient {
  async get ({ url, params }: HttpGetClient.Params): Promise<void> {
    await axios.get(url, { params })
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient

  const fakeAxios = axios as jest.Mocked<typeof axios>
  const url = 'any'
  const params = { any: 'param' }

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  it('should call get with correct params', async () => {
    await sut.get({ url, params })

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
    expect(fakeAxios.get).toHaveBeenCalledTimes(1)
  })
})
