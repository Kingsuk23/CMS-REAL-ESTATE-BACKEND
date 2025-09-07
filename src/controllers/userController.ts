import { Request, Response, NextFunction } from 'express';
import { userType } from '../models/userTypes';
import { createUserService } from '../services/userService';
import { HttpStatusCode } from '../models/httpStatusCode';
import { generateToken } from '../utils/genrateToken';

export const registerUser = async (
  req: Request<{}, {}, userType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name, password } = req.body;
    // new user register logic
    const user = await createUserService({ name, email, password });

    // Generate jwt token
    const token = generateToken(user.id);
    res.status(HttpStatusCode.OK).json({
      message: 'User Created successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};
