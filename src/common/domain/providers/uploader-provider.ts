export type UploaderProps = {
  fileName: string
  fileType: string
  fileContent: Buffer
}
export interface UploaderProvider {
  upload(params: UploaderProps): Promise<string>
}
