import { NextFunction, Request, Response } from 'express';
import { inquiriesService } from '../services/inquiriesService';
import { HttpStatusCode } from '../models/httpStatusCode';
import { inquiriesType } from '../models/inquiriesType';

export const inquiriesController = async (
  req: Request<{ id: string }, {}, inquiriesType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { email, message, name } = req.body;
    const newInquiries = await inquiriesService({
      email,
      message,
      name,
      properties_id: id,
    });

    res.status(HttpStatusCode.Created).json({
      message: 'Inquiry created successfully',
      id: newInquiries.id,
    });
  } catch (error) {
    next(error);
  }
};
