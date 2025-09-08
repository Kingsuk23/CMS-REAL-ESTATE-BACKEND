import { Request, Response, NextFunction } from 'express';
import { UserLoginType, userType } from '../models/userTypes';
import {
  createUserService,
  loginUserService,
  userLogout,
} from '../services/userService';
import { HttpStatusCode } from '../models/httpStatusCode';
import { generateToken } from '../utils/genrateToken';
import { CustomRequest } from '../models/customType';

export const registerUser = async (
  req: Request<{}, {}, userType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name, password } = req.body;
    // new user register logic
    const user = await createUserService({ name, email, password });

    const data = {
      user: {
        id: user.id,
      },
    };
    // Generate jwt token
    const token = await generateToken(data);

    // send response to user
    res.status(HttpStatusCode.OK).json({
      message: 'User Created successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request<{}, {}, UserLoginType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // validate user exist or not
    const user = await loginUserService({ email, password });

    const data = {
      user: {
        id: user.id,
      },
    };
    const token = await generateToken(data);
    res.status(HttpStatusCode.OK).json({
      message: 'User login successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as CustomRequest).user;
    const is_user_exist = await userLogout(user.id);
    res.status(HttpStatusCode.OK).json({
      message: 'User Log out',
    });
  } catch (error) {
    next(error);
  }
};
