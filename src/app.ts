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
