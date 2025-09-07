import { Router } from 'express';
import { registerUser } from '../controllers/userController';

const route = Router();

route.post('/register', registerUser);

export default route;
