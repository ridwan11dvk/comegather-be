import { inject, injectable } from 'inversify';
import { Model } from 'objection';
import { Express } from 'express';
import {
  Delete,
  Example, Path, Post, Request, Response, Route, Security, SuccessResponse, Tags, UploadedFile,
} from 'tsoa';
import { unlink } from 'fs/promises';
import TYPES, { Result, UserRequest } from '../types';
import { IFileUC } from '../usecase/IFile';
import { IFileController } from './IFile';
import { IFile } from '../models/dto/File';
import { IUserUC } from '../usecase/IUser';
import { defaultResp, errorMsg } from '../models/dto';

@Tags('Files')
@Route('files')
@injectable()
export class FileController implements IFileController {
  private FileUC: IFileUC;

  private UserUC: IUserUC;

  constructor(
    @inject(TYPES.IFileUC) FileUC: IFileUC,
    @inject(TYPES.IUserUC) UserUC: IUserUC,
  ) {
    this.FileUC = FileUC;
    this.UserUC = UserUC;
  }

  /**
   * Uploads profile picture of user
   */
  @Post('/upload-pp')
  @SuccessResponse(200, 'Ok')
  @Example({
    data: {
      id: 9999,
      url: 'iniurl.com/2022/04/12/78fdf0e7-101c-418b-86c8-14712f3c8c28.jpg',
    },
  })
  @Response<errorMsg>(500, 'Server Error', {
    message: 'Cannot upload photo profile',
  })
  async UploadPP(
    @Request() req: UserRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Result> {
    const trx = await Model.startTransaction();
    try {
      const {
        filename, mimetype, size,
      } = file;
      const ifile: IFile = {
        fileName: filename,
        mimeType: mimetype,
        url: process.env.BASE_URL.concat(`public/${filename}`),
        size,
      };
      const id = await this.FileUC.Create(ifile, trx);
      const { user } = req;
      const oldImageID = user.imageId;
      user.imageId = id;
      const success = await this.UserUC.UpdateByID(user.id, { user }, trx);
      if (!success) {
        await trx.rollback();
        return {
          error: {
            code: 500,
            details: 'Cannot upload photo profile',
          },
        };
      }
      const successpatch = await this.FileUC.PatchInUseByID(id, trx);
      if (!successpatch) {
        await trx.rollback();
        return {
          error: {
            code: 500,
            details: 'Cannot patch file in used',
          },
        };
      }
      if (oldImageID) {
        const oldImage = await this.FileUC.Delete(oldImageID, trx);
        await unlink(`${__dirname}/../../public/${oldImage.fileName}`);
      }
      await trx.commit();
      return {
        result: {
          id,
          url: ifile.url,
        },
      };
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  /**
   * Uploads profile picture of user
   */
   @Post('/')
   @SuccessResponse(200, 'Ok')
   @Example({
     data: {
       id: 9999,
       url: 'iniurl.com/2022/04/12/78fdf0e7-101c-418b-86c8-14712f3c8c28.jpg',
     },
   })
   @Response<errorMsg>(500, 'Server Error', {
     message: 'Cannot upload photo',
   })
  async Upload(
     @Request() req: UserRequest,
     @UploadedFile() file: Express.Multer.File,
  ): Promise<Result> {
    const {
      filename, mimetype, size,
    } = file;
    const ifile: IFile = {
      fileName: filename,
      mimeType: mimetype,
      url: process.env.BASE_URL.concat(`public/${filename}`),
      size,
    };
    const id = await this.FileUC.Create(ifile);
    return {
      result: {
        id,
        url: ifile.url,
      },
    };
  }

  @Delete('/:ID')
  @Security('accessToken')
  @Example<defaultResp>(null)
  @Response<errorMsg>(500, 'server error', {
    message: 'Cannot delete file',
  })
  @Response<errorMsg>(404, 'file not found', {
    message: 'File not found',
  })
   async Delete(@Path() ID: number): Promise<Result> {
     const file = await this.FileUC.Delete(ID);
     if (!file) {
       return {
         error: {
           code: 404,
           details: 'not found',
         },
       };
     }
     await unlink(`${__dirname}/../../public/${file.fileName}`);
     return {};
   }
}
