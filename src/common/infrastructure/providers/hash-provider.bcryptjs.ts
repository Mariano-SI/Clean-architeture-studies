import { HashProvider } from '@/common/domain/providers/hash-provider'
import { hash, compare } from 'bcryptjs'

export class HashProviderBcryptjs implements HashProvider {
  async generateHash(payload: string): Promise<string> {
    return await hash(payload, 6)
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed)
  }
}
