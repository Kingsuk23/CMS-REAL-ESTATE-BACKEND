import { BaseError } from '../config/baseError';
import { HttpStatusCode } from '../models/httpStatusCode';
import { UserLoginType, userType } from '../models/userTypes';
import bcrypt from 'bcrypt';
import prisma from '../config/database';
import disposableEmailDetector from 'disposable-email-detector';

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

    //check this email is temporary or not
    const is_disposable = await disposableEmailDetector(email);

    if (is_disposable) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'This email not register',
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

export const loginUserService = async ({
  email,
  password,
}: UserLoginType): Promise<{ id: string }> => {
  try {
    // Validate all inputs are there or not
    if (!email || !password) {
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
      select: { hash_password: true, id: true },
    });

    if (!is_user_exist) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Invalid user input',
        true,
      );
    }

    // validate password is correct or note
    const original_password = bcrypt.compareSync(
      password,
      is_user_exist.hash_password,
    );

    if (!original_password) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Invalid user input',
        true,
      );
    }

    // send user id
    const user = { id: is_user_exist.id };
    return user;
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

export const userLogout = async (_id: string): Promise<string> => {
  try {
    // find user
    const is_user_exist = await prisma.user.findUnique({
      where: { id: _id },
      select: { id: true },
    });

    // validate user
    if (!is_user_exist) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Invalid request',
        true,
      );
    }

    return is_user_exist.id;
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
