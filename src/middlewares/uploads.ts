import multer from 'multer';
import path from 'node:path';
import fs from 'fs';
import { BaseError } from '../config/baseError';
import { HttpStatusCode } from '../models/httpStatusCode';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/temp/';

    // check file upload folder exist or not & create upload folder
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    //sanitize user files
    const sanitizedFileName = path
      .basename(file.originalname)
      .replace(/[^\w.-]/g, '_');

    // Generate unique file name every time
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + sanitizedFileName);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // validate file types. user only upload this file types
  if (!file.mimetype.match(/\.(jpeg|png|mp4|webm|ogg|mkv)$/)) {
    cb(null, true);
  } else {
    throw new BaseError(
      'UNSUPPORTED MEDIA TYPE',
      HttpStatusCode.UnsupportedMediaType,
      'Unsupported media file',
      true,
    );
  }
};

export const upload = multer({
  storage: storage,
  // fileFilter,
  // limit file size that upload
  limits: { fileSize: Infinity, files: 6 },
});
