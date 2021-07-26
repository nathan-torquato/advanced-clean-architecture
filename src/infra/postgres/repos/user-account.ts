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

  async saveWithFacebookData (params: SaveFacebookAccountRepo.Params): Promise<SaveFacebookAccountRepo.Result> {
    const { id, ...accountData } = params

    if (!id) {
      await this.userRepo.save(accountData)
    } else {
      await this.userRepo.update({ id: +id }, {
        facebookId: params.facebookId,
        name: params.name
      })
    }

    return {} as any
  }
}
