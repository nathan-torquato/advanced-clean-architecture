export interface HttpGetClient {
  get: <T = any, U = any>(params: HttpGetClient.Params<U>) => Promise<T>
}

export namespace HttpGetClient {
  export type Params<U> = {
    url: string
    params?: U
  }
}
