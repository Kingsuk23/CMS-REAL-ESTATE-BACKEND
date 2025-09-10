import { Queue } from 'bullmq';

export const file_store = new Queue('file_scanner', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    username: 'default',
  },
  defaultJobOptions: {
    removeOnComplete: { age: 86400 }, // remove completed jobs after 1 day (in seconds)
    removeOnFail: { age: 604800 }, // remove failed jobs after 7 days
  },
});
