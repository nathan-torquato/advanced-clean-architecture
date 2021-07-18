export interface LoadUserAccountRepo {
  load: (params: LoadUserAccountRepo.Params) => Promise<LoadUserAccountRepo.Result>
}
export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    email: string
    name?: string
  }
}

export interface CreateFacebookAccountRepo {
  createFromFacebook: (params: CreateFacebookAccountRepo.Params) => Promise<void>
}
export namespace CreateFacebookAccountRepo {
  export type Params = {
    facebookId: string
    name: string
    email: string
  }
}

export interface UpdateFacebookAccountRepo {
  updateWithFacebook: (params: UpdateFacebookAccountRepo.Params) => Promise<void>
}
export namespace UpdateFacebookAccountRepo {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }
}
