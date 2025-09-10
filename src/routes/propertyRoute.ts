import { Router } from 'express';
import { validateUserAuth } from '../middlewares/validateUser';
import {
  listPropertyController,
  deletePropertyController,
  getManyPropertyController,
  getOnePropertyController,
  updatePropertyController,
  publishPropertyController,
  propertyMediaController,
} from '../controllers/propetiesController';
import { upload } from '../middlewares/uploads';

const route = Router();

route
  .post(
    '/properties',
    validateUserAuth,
    upload.fields([
      { name: 'image', maxCount: 5 },
      { name: 'video', maxCount: 1 },
    ]),
    listPropertyController,
  )
  .put('/properties/:id', validateUserAuth, updatePropertyController)
  .delete('/properties/:id', validateUserAuth, deletePropertyController)
  .get('/properties/:id', validateUserAuth, getOnePropertyController)
  .get('/properties', validateUserAuth, getManyPropertyController)
  .put('/properties/:id/publish', validateUserAuth, publishPropertyController)
  .post(
    '/properties/:id/media',
    validateUserAuth,
    upload.fields([
      { name: 'image', maxCount: 5 },
      { name: 'video', maxCount: 1 },
    ]),
    propertyMediaController,
  );

export default route;
