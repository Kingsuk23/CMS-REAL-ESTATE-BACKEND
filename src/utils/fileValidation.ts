import { fileTypeFromBuffer } from 'file-type';
import { BaseError } from '../config/baseError';
import { HttpStatusCode } from '../models/httpStatusCode';
import { MAX_SIZE_BY_TYPE } from './allowdFileType';

export const fileValidation = async (file: Express.Multer.File) => {
  try {
    //check fill exist or not
    if (!file) {
      throw new BaseError(
        'UPLOAD ERROR',
        HttpStatusCode.BadRequest,
        'No files were uploaded.',
        false,
      );
    }

    // check file type from file buffer

    if (!file.path) {
      throw new BaseError(
        'UPLOAD ERROR',
        HttpStatusCode.BadRequest,
        `File path is missing: ${file.originalname}`,
        false,
      );
    }

    const type = await fileTypeFromBuffer(file.buffer);

    if (!type || !MAX_SIZE_BY_TYPE[type.mime] || type === undefined) {
      throw new BaseError(
        'INVALID FILE TYPE',
        HttpStatusCode.BadRequest,
        `File type not allowed: ${file.originalname}`,
        false,
      );
    }
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      `Failed to update property: ${(error as Error).message}`,
      false,
    );
  }
};
