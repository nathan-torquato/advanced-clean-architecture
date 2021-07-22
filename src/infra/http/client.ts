export interface HttpClient {
  get: <T = any, U = any>(params: HttpClient.Params<U>) => Promise<T>
}

export namespace HttpClient {
  export type Params<U> = {
    url: string
    params?: U
  }
}
