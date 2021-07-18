export interface LoadfacebookUserApi {
  loadUser: (params: LoadfacebookUserApi.Params) => Promise<LoadfacebookUserApi.Result>
}

export namespace LoadfacebookUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined | {
    name: string
    email: string
    facebookId: string
  }
}
