import { Pojo } from 'objection';
import Generic from './Generic';

class File extends Generic {
  fileName!: string;

  mimeType!: string;

  url!: string;

  size!: number;

  inUsed!: boolean;

  static get tableName() {
    return 'files';
  }

  static get jsonSchema() {
    // TODO: add input DTO here
    // User.fromJson will call this
    return {
      type: 'object',
      properties: {
        fileName: {
          description: 'file name of the file',
          type: 'string',
        },
        mimeType: {
          description: 'mime type of the file',
          type: 'string',
        },
        url: {
          description: 'url of the file',
          type: 'string',
        },
        size: {
          description: 'size of the file',
          type: 'number',
        },
      },
      required: ['fileName', 'mimeType', 'url', 'size'],
    };
  }

  $formatJson(json: Pojo): Pojo {
    // TODO: add output DTO here
    const _json = super.$formatJson(json);
    delete _json.fileName;
    delete _json.mimeType;
    delete _json.size;
    return _json;
  }
}

export default File;
