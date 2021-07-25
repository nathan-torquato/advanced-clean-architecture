import { getRepository } from 'typeorm'

import { LoadUserAccountRepo } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepo implements LoadUserAccountRepo {
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
}
