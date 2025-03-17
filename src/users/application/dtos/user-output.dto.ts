export class UserOutputDto {
  id: string
  name: string
  email: string
  avatar: string | null
  created_at: Date
  updated_at: Date

  constructor(data: Partial<UserOutputDto>) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.avatar = data.avatar
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }
}
