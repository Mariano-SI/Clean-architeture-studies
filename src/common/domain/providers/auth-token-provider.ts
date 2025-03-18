export type GeneratedToken = {
  access_token: string
}

export type VerifyAuthKeyProps = {
  user_id: string
}

export interface AuthTokenProvider {
  generateAuthToken(userId: string): GeneratedToken
  verifyAuthToken(token: string): VerifyAuthKeyProps
}
