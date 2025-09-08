import { Router } from 'express';
import { loginUser, registerUser, logout } from '../controllers/userController';
import { validateUserAuth } from '../middlewares/validateUser';

const route = Router();

route
  .post('/register', registerUser)
  .post('/login', loginUser)
  .get('/logout', validateUserAuth, logout);

export default route;
