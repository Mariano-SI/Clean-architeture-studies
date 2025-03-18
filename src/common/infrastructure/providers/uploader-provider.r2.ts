import {
  UploaderProps,
  UploaderProvider,
} from '@/common/domain/providers/uploader-provider'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env } from '../env'

export class UploaderProviderR2 implements UploaderProvider {
  private readonly client: S3Client

  constructor() {
    this.client = new S3Client({
      endpoint: env.CLOUDFLARE_R2_URL,
      region: 'auto',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }
  async upload({
    fileName,
    fileType,
    fileContent,
  }: UploaderProps): Promise<string> {
    this.client.send(
      new PutObjectCommand({
        Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
        Body: fileContent,
      }),
    )
    return fileName
  }
}
