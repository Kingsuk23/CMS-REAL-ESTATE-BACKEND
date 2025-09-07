import express, { NextFunction, Request, Response } from 'express';
import { centralizedErrorHandlerMiddlerWare } from './middlewares/centralizedErrorHandler';
import { BaseError } from './config/baseError';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/user', (req, res, next) => {
  const error = new BaseError('BAD REQUEST', 400, 'Missing param', true);
  next(error);
});

// Error handler middler ware
app.use(centralizedErrorHandlerMiddlerWare);

export default app;
