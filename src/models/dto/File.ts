import File from '../dao/File';

export interface IFile{
  fileName: string,
  mimeType: string,
  url: string,
  size: number,
  extension?: string
}

export const toDAO = (file: IFile) => File.fromJson(file, { skipValidation: false });
