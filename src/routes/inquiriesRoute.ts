import { Router } from 'express';
import { inquiriesController } from '../controllers/inquiriesController';

const route = Router();

route.post('/inquiries/:id', inquiriesController);

export default route;
