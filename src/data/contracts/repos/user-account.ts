export interface LoadUserAccountRepo {
  load: (params: LoadUserAccountRepo.Params) => Promise<void>
}
export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }
}

export interface CreateUserAccountRepo {
  createFromFacebook: (params: CreateUserAccountRepo.Params) => Promise<void>
}
export namespace CreateUserAccountRepo {
  export type Params = {
    facebookId: string
    name: string
    email: string
  }
}
