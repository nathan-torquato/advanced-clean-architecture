import { IBackup, IMemoryDb } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepo } from '@/infra/postgres/repos'
import { makeFakeDb } from '@/../tests/infra/postgres/mocks'

describe('PgUserAccountRepo', () => {
  let sut: PgUserAccountRepo

  let db: IMemoryDb
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    db = await makeFakeDb()
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

  describe('load', () => {
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

  describe('saveWithFacebookData', () => {
    it('should create an account if id is undefined', async () => {
      await sut.saveWithFacebookData({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_facebookId',
      })

      const pgUserCount = await pgUserRepo.count({ email: 'any_email' })
      expect(pgUserCount).toBe(1)
    })
  })
})
