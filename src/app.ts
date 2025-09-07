import { errorHandle } from './config/errorHandle';

// handle unhandled Rejection by promises
process.on('unhandledRejection', (reason, promise) => {
  throw reason;
});

// unhandled error by try and catch block
process.on('uncaughtException', (error: Error) => {
  errorHandle.handleError(error);
  if (!errorHandle.isTrustedError(error)) {
    process.exit(1);
  }
});

import express from 'express';
import { centralizedErrorHandlerMiddlerWare } from './middlewares/centralizedErrorHandler';
import userRoutes from './routes/userRoute';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', userRoutes);
app.get('/test', (req, res) => {
  res.send('Server works!');
});
// Error handler middler ware
app.use(centralizedErrorHandlerMiddlerWare);

export default app;
