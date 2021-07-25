import { IBackup, newDb } from 'pg-mem'
import { Column, Entity, getConnection, getRepository, PrimaryGeneratedColumn, Repository } from 'typeorm'

import { LoadUserAccountRepo } from '@/data/contracts/repos'

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'nome', nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string
}

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
