export type GeneratedToken = {
  access_token: string
}

export type AuthKeyProps = {
  user_id: string
}

export interface TokenProvider {
  generateAuthToken(userId: string): GeneratedToken
  verifyAuthToken(token: string): AuthKeyProps
}
