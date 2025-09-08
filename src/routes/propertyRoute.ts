import { Router } from 'express';
import { validateUserAuth } from '../middlewares/validateUser';
import {
  listPropertyController,
  deletePropertyController,
  getManyPropertyController,
  getOnePropertyController,
  updatePropertyController,
  publishPropertyController,
} from '../controllers/propetiesController';

const route = Router();

route
  .post('/properties', validateUserAuth, listPropertyController)
  .put('/properties/:id', validateUserAuth, updatePropertyController)
  .delete('/properties/:id', validateUserAuth, deletePropertyController)
  .get('/properties/:id', validateUserAuth, getOnePropertyController)
  .get('/properties', validateUserAuth, getManyPropertyController)
  .put('/properties/:id/publish', validateUserAuth, publishPropertyController);

export default route;
