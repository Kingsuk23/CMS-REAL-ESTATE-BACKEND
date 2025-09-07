import { BaseError } from '../config/baseError';
import { HttpStatusCode } from '../models/httpStatusCode';
import { userType } from '../models/userTypes';
import bcrypt from 'bcrypt';
import prisma from '../config/database';

export const createUserService = async ({
  email,
  name,
  password,
}: userType): Promise<{ id: string }> => {
  try {
    // Validate all inputs are there or not
    if (!email || !name || !password) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Missing required fields',
        true,
      );
    }

    //Find user that already exist or not
    const is_user_exist = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (is_user_exist) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'User already exist',
        true,
      );
    }
    //Generate slot for create hash password
    const slot = bcrypt.genSaltSync(10);

    // Generate hash
    const hashPassword = bcrypt.hashSync(password, slot);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        hash_password: hashPassword,
      },
      select: { id: true },
    });

    return newUser;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      'Failed to create user',
      false,
    );
  }
};
