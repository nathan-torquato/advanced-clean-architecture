import axios from 'axios'

import { HttpGetClient } from '@/infra/http/client'

export class AxiosHttpClient implements HttpGetClient {
  async get <T>({ url, params }: HttpGetClient.Params): Promise<T> {
    const response = await axios.get<T>(url, { params })
    return response.data
  }
}
