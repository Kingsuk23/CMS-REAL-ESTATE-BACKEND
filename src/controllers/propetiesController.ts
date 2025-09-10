import { NextFunction, Request, Response } from 'express';
import { propertyListingType } from '../models/property';
import { CustomRequest } from '../models/customType';
import {
  deletePropertyService,
  getManyPropertyService,
  getOnePropertyService,
  listPropertyService,
  propertyMedia,
  publicPropertyService,
  updatePropertyService,
} from '../services/propertiesService';
import { HttpStatusCode } from '../models/httpStatusCode';
import { status } from '@prisma/client';

export const listPropertyController = async (
  req: Request<{}, {}, propertyListingType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      address,
      area,
      bathrooms,
      bedrooms,
      description,
      price,
      property_special_type,
      property_sub_type,
      property_type,
      title,
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const agent_id = (req as CustomRequest).user.id;

    const newPropertyListing = await listPropertyService({
      address,
      agent_id,
      area,
      bathrooms,
      bedrooms,
      description,
      price,
      property_special_type,
      property_sub_type,
      property_type,
      title,
    });
    res.status(HttpStatusCode.Created).json({
      message: 'Property listed successfully',
      id: newPropertyListing.id,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePropertyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const agent_id = (req as CustomRequest).user.id;
    const update = req.body;

    const updateProperty = await updatePropertyService({
      id,
      agent_id,
      ...update,
    });

    res.status(HttpStatusCode.OK).json({
      message: 'Property listed successfully',
      id: updateProperty.id,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePropertyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const agent_id = (req as CustomRequest).user.id;
    const deleteProperty = await deletePropertyService(id, agent_id);

    res.status(HttpStatusCode.NoContent).json({
      message: 'Property Deleted successfully',
      id: deleteProperty.id,
    });
  } catch (error) {
    next(error);
  }
};

export const getOnePropertyController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const getOneProperty = await getOnePropertyService(id);

    res.status(HttpStatusCode.OK).json({
      message: 'Find Property successfully',
      property: getOneProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const getManyPropertyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agent_id = (req as CustomRequest).user.id;
    const getManyProperty = await getManyPropertyService(agent_id);

    res.status(HttpStatusCode.OK).json({
      message: 'Find All Properties successfully',
      property: getManyProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const publishPropertyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const propertyId = req.params.id;
    const agent_id = (req as CustomRequest).user.id;
    const status: status = 'published';
    const publicProperty = await publicPropertyService(
      propertyId,
      status,
      agent_id,
    );

    res.status(HttpStatusCode.OK).json({
      message: 'Find All Properties successfully',
      property: publicProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const propertyMediaController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const propertyId = req.params.id;
    const file = req.files as { [fieldname: string]: Express.Multer.File[] };
    const propertyMediaResponse = await propertyMedia(propertyId, file);
    console.log(propertyMediaResponse);
    res.status(HttpStatusCode.OK).json({
      message: 'Find All Properties successfully',
      job_ids: propertyMediaResponse,
    });
  } catch (error) {
    next(error);
  }
};
