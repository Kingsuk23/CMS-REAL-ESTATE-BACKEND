import { BaseError } from '../config/baseError';
import prisma from '../config/database';
import { HttpStatusCode } from '../models/httpStatusCode';
import { inquiriesType } from '../models/inquiriesType';

export const inquiriesService = async ({
  email,
  message,
  name,
  properties_id,
}: inquiriesType) => {
  try {
    // basic validation
    if (!email || !message || !name || !properties_id) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Missing required fields',
        true,
      );
    }

    // create new inquiries
    const inquiries = await prisma.inquiries.create({
      data: { email, message, name, properties_id },
      select: {
        id: true,
      },
    });

    return inquiries;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      `Failed to create property listing: ${(error as Error).message}`,
      false,
    );
  }
};
