import { Express } from 'express';
import { Result, UserRequest } from '../types';

export interface IFileController{
  UploadPP(req: UserRequest, file: Express.Multer.File): Promise<Result>,
  Upload(req: UserRequest, file: Express.Multer.File): Promise<Result>,
  Delete(id: number): Promise<Result>,
}
