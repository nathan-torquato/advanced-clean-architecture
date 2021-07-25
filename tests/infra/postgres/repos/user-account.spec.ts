import { IBackup, newDb } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepo } from '@/infra/postgres/repos'

describe('PgUserAccountRepo', () => {
  let sut: PgUserAccountRepo

  const db = newDb()
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser]
    })
    await connection.synchronize()
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepo()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  it('should return an account if email exists', async () => {
    await pgUserRepo.save({ email: 'existing_email' })

    const sut = new PgUserAccountRepo()

    const account = await sut.load({ email: 'existing_email' })
    expect(account?.id).toBeTruthy()
  })

  it('should return undefined if email does not exist', async () => {
    const account = await sut.load({ email: 'non_existing_email' })
    expect(account).toBeUndefined()
  })
})
