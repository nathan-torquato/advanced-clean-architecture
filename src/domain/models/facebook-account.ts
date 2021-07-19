type FacebookUser = {
  name: string
  email: string
  facebookId: string
}

type UserAccount = {
  id?: string
  name?: string
}

export class FacebookAccount {
  id?: string
  name: string
  email: string
  facebookId: string

  constructor (facebookUser: FacebookUser, userAccount?: UserAccount) {
    this.id = userAccount?.id
    this.name = userAccount?.name ?? facebookUser.name
    this.email = facebookUser.email
    this.facebookId = facebookUser.facebookId
  }
}
