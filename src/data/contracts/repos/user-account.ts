export interface LoadUserAccountRepo {
  load: (params: LoadUserAccountRepo.Params) => Promise<void>
}

export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }
}
