import 'dotenv/config';
import { Job, Worker } from 'bullmq';
import { fileValidation } from './fileValidation';
import NodeClam from 'clamscan';
import { ClamScanOption } from '../config/clamScanConfig';
import path from 'node:path';

const ClamScan = new NodeClam().init(ClamScanOption);

const FileScanWorker = new Worker(
  'file_scanner',
  async (job: Job<{ file: Express.Multer.File }>) => {
    const { file } = job.data;

    // await fileValidation(file);

    ClamScan.then(async (clamscan) => {
      console.log(file);
      try {
        const {
          file: ScanFile,
          isInfected,
          viruses,
        } = await clamscan.scanFile(path.resolve(file.path));
        console.log(isInfected);
        if (isInfected) {
          console.log(`${ScanFile} is infected with ${viruses}!`);
        }
      } catch (error) {
        console.error(error);
      }
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      username: 'default',
    },
  },
);
