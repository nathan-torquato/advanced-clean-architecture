import { getRepository } from 'typeorm'

import { LoadUserAccountRepo, SaveFacebookAccountRepo } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepo implements LoadUserAccountRepo, SaveFacebookAccountRepo {
  private readonly userRepo = getRepository(PgUser)

  async load ({ email }: LoadUserAccountRepo.Params): Promise<LoadUserAccountRepo.Result> {
    const user = await this.userRepo.findOne({ email })
    if (!user) {
      return
    }

    return {
      id: user.id.toString(),
      name: user.name,
    }
  }

  saveWithFacebookData (params: SaveFacebookAccountRepo.Params): Promise<SaveFacebookAccountRepo.Result> {
    if (!params.id) {
      return this.createAccount(params)
    }

    return this.updateAccount(params)
  }

  private async createAccount (params: SaveFacebookAccountRepo.Params): Promise<SaveFacebookAccountRepo.Result> {
    const { id, ...accountData } = params
    const newuser = await this.userRepo.save(accountData)
    return {
      id: newuser.id.toString()
    }
  }

  private async updateAccount (params: SaveFacebookAccountRepo.Params): Promise<SaveFacebookAccountRepo.Result> {
    const id = params.id as string
    const { facebookId, name } = params

    await this.userRepo.update({ id: +id }, {
      facebookId,
      name,
    })

    return { id }
  }
}
