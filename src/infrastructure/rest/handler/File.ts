import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import fs from 'fs';
import { unlink } from 'fs/promises';
import log4js from 'log4js';
import { Request, Response, Express } from 'express';
import TYPES, { UserRequest } from '../../../types';
import { IFileController } from '../../../controller/IFile';
import container from '../../inversify.config';

const log = log4js.getLogger('FileHandler');

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, path.join(__dirname, '../../../../public'));
  },

  // By default, multer removes file extensions so let's add them back.
  filename(_req, file, cb) {
    const imageId = uuidv4();
    const currDate = new Date();

    const date = `0${currDate.getDate()}`.slice(-2);
    const month = `0${currDate.getMonth() + 1}`.slice(-2);
    const year = currDate.getFullYear();

    // ${path.extname(file.originalname)}
    const imageName = `${year}/${month}/${date}/${imageId}${path.extname(file.originalname)}`;
    const currPath = path.join(__dirname, '../../../../public/', `${year}/${month}/${date}`);

    // Create folder recursively before.
    fs.mkdirSync(currPath, { recursive: true });

    cb(null, imageName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const extFile = path.extname(file.originalname);

  const filetypeallowed = /png|jpg|jpeg|webp/;

  const mimeAllowed = filetypeallowed.test(file.mimetype);

  if (!mimeAllowed || (extFile !== '.png' && extFile !== '.jpg' && extFile !== '.jpeg' && extFile !== '.webp')) {
    return cb(null, false);
  }
  // Limited to 5mb
  if (file.size > 5000000) {
    return cb(null, false);
  }
  return cb(null, true);
};

export class FileHandler {
  private controller: IFileController;

  constructor() {
    this.controller = container.get<IFileController>(TYPES.IFileController);
  }

  async UploadPP(
    req: UserRequest,
    res: Response,
  ): Promise<void | Response<any, Record<string, any>>> {
    const upload = multer({ storage, fileFilter }).single('file');
    return upload(req, res, async (err: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Can\'t upload file',
        });
      }
      if (!req.file) {
        return res.status(400).json({
          message: 'File not supported or too large',
        });
      }
      try {
        const result = await this.controller.UploadPP(req, req.file);
        if (result.error) {
          await unlink(path.join(__dirname, '../../../../public', req.file.filename));
          return res.status(result.error.code).json({
            message: result.error.details,
          });
        }
        return res.json({
          data: result.result,
        });
      } catch (error) {
        await unlink(path.join(__dirname, '../../../../public', req.file.filename));
        log.error(error.message);
        return res.status(500).json({
          message: 'Can\'t upload file',
        });
      }
    });
  }

  async Upload(
    req: UserRequest,
    res: Response,
  ): Promise<void | Response<any, Record<string, any>>> {
    const upload = multer({ storage, fileFilter }).single('file');
    return upload(req, res, async (err: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Can\'t upload file',
        });
      }
      if (!req.file) {
        return res.status(400).json({
          message: 'File not supported or too large',
        });
      }
      try {
        const result = await this.controller.Upload(req, req.file);
        if (result.error) {
          await unlink(path.join(__dirname, '../../../../public', req.file.filename));
          return res.status(result.error.code).json({
            message: result.error.details,
          });
        }
        return res.json({
          data: result.result,
        });
      } catch (error) {
        await unlink(path.join(__dirname, '../../../../public', req.file.filename));
        log.error(error.message);
        return res.status(500).json({
          message: 'Can\'t upload file',
        });
      }
    });
  }

  async Delete(
    req: UserRequest,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const { ID } = req.params;
    const id = parseInt(`${ID}`, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: 'Invalid id',
      });
    }
    try {
      const { error } = await this.controller.Delete(id);
      if (error) {
        return res.status(error.code).json({
          message: error.details,
        });
      }
      return res.sendStatus(204);
    } catch (err) {
      log.error(err.message);
      return res.status(500).json({
        message: 'Could not delete file',
      });
    }
  }
}
