import { BaseError } from '../config/baseError';
import { HttpStatusCode } from '../models/httpStatusCode';
import { MAX_SIZE_BY_TYPE } from './allowdFileType';

export const verifyFilesLengthAndSize = (
  fieldName: string,
  FileLength: number,
  files: { [fieldname: string]: Express.Multer.File[] },
) => {
  const fileArray = files[fieldName];
  if (!fileArray || fileArray.length > FileLength) {
    throw new BaseError(
      'BAD REQUEST',
      HttpStatusCode.BadRequest,
      `or you upload ${fieldName} more then ${FileLength}`,
      true,
    );
  }

  for (const file of fileArray) {
    const maxSize = MAX_SIZE_BY_TYPE[file.mimetype];
    if (file.size > maxSize) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        `File too large: ${file.originalname}`,
        true,
      );
    }
  }
};
