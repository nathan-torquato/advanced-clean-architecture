export interface LoadUserAccountRepo {
  load: (params: LoadUserAccountRepo.Params) => Promise<LoadUserAccountRepo.Result>
}
export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface SaveFacebookAccountRepo {
  saveWithFacebookData: (params: SaveFacebookAccountRepo.Params) => Promise<SaveFacebookAccountRepo.Result>
}
export namespace SaveFacebookAccountRepo {
  export type Params = {
    id?: string
    name: string
    email: string
    facebookId: string
  }

  export type Result = {
    id: string
  }
}
