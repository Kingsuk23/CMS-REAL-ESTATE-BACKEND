import { status } from '@prisma/client';
import { BaseError } from '../config/baseError';
import prisma from '../config/database';
import { HttpStatusCode } from '../models/httpStatusCode';
import { propertyListingType } from '../models/property';
import { propertyUpdateType } from '../models/property';

export const listPropertyService = async ({
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
}: propertyListingType) => {
  try {
    // basic validation
    if (
      !address ||
      !area ||
      !bathrooms ||
      !bedrooms ||
      !description ||
      !price ||
      !property_special_type ||
      !property_sub_type ||
      !property_type ||
      !title
    ) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Missing required fields',
        true,
      );
    }

    const url = 'buvh';

    // create new property
    const property_listing = await prisma.properties.create({
      data: {
        address,
        area,
        agent_id,
        bathrooms,
        bedrooms,
        description,
        price,
        property_sub_type,
        property_type,
        title,
        status: 'draft',
        property_special_type,
        Media: {
          create: { url, type: 'image' },
        },
      },
      select: {
        id: true,
      },
    });

    return property_listing;
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

export const updatePropertyService = async ({
  id,
  address,
  area,
  agent_id,
  bathrooms,
  bedrooms,
  description,
  price,
  property_special_type,
  property_sub_type,
  property_type,
  title,
}: propertyUpdateType) => {
  try {
    // valid property id
    if (!id) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Property ID is required',
        true,
      );
    }

    // find property using id
    const property = await prisma.properties.findUnique({
      where: { id: id },
      select: { id: true, agent_id: true },
    });

    // property not found
    if (!property) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.NotModified,
        `Don't find any property`,
        false,
      );
    }

    // Construct update object
    const updatePropertyValue = {
      ...(address && { address }),
      ...(area && { area }),
      ...(bathrooms && { bathrooms }),
      ...(bedrooms && { bedrooms }),
      ...(description && { description }),
      ...(price && { price }),
      ...(property_special_type && { property_special_type }),
      ...(property_sub_type && { property_sub_type }),
      ...(property_type && { property_type }),
      ...(title && { title }),
    };

    // if don't contain any field this throw error
    if (Object.keys(updatePropertyValue).length === 0) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'No fields provided to update',
        true,
      );
    }

    if (property.agent_id !== agent_id) {
      throw new BaseError(
        'FORBIDDEN',
        HttpStatusCode.Forbidden,
        'You are not allowed to modify this property',
        true,
      );
    }

    // update property by property id
    const updateProperty = await prisma.properties.update({
      where: { id: id },
      data: updatePropertyValue,
      select: { id: true },
    });

    return updateProperty;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      `Failed to update property: ${(error as Error).message}`,
      false,
    );
  }
};

export const deletePropertyService = async (id: string, agent_id: string) => {
  try {
    // valid property id
    if (!id) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Property ID is required',
        true,
      );
    }

    // find property using id
    const property = await prisma.properties.findUnique({
      where: { id: id },
      select: { id: true, agent_id: true },
    });

    // find property using id
    if (!property) {
      throw new BaseError(
        'FAILED TO DELETE',
        HttpStatusCode.NotFound,
        `Failed to delete property`,
        false,
      );
    }

    if (property.agent_id !== agent_id) {
      throw new BaseError(
        'FORBIDDEN',
        HttpStatusCode.Forbidden,
        'You are not allowed to modify this property',
        true,
      );
    }

    // delete property by property id
    const deleteProperty = await prisma.properties.delete({
      where: { id: id },
      select: { id: true },
    });

    return deleteProperty;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      `Failed to delete property: ${(error as Error).message}`,
      false,
    );
  }
};

export const getOnePropertyService = async (id: string) => {
  try {
    // valid property id
    if (!id) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Property ID is required',
        true,
      );
    }

    // find property using id
    const property = await prisma.properties.findUnique({
      where: { id: id },
      include: { Media: true },
    });

    if (!property) {
      throw new BaseError(
        'NOT FOUND',
        HttpStatusCode.NotFound,
        `Don't find any property`,
        false,
      );
    }

    return property;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      `Failed to find property listing: ${(error as Error).message}`,
      false,
    );
  }
};

export const getManyPropertyService = async (userId: string) => {
  try {
    // valid user id
    if (!userId) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Agent ID is required',
        true,
      );
    }

    // find property using id
    const property = await prisma.properties.findMany({
      where: { agent_id: userId },
    });

    return property;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      `Failed to find properties: ${(error as Error).message}`,
      false,
    );
  }
};

export const publicPropertyService = async (
  id: string,
  status: status,
  agent_id: string,
) => {
  try {
    // Valid user id
    if (!id) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Property ID is required',
        true,
      );
    }

    // valid status
    if (!status) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Property Status is required',
        true,
      );
    }

    // find property using id
    const property = await prisma.properties.findUnique({
      where: { id: id },
      select: { id: true, agent_id: true },
    });

    // property not found
    if (!property) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.NotModified,
        `Don't find any property`,
        false,
      );
    }

    // if note found property user throw error
    if (property.agent_id !== agent_id) {
      throw new BaseError(
        'FORBIDDEN',
        HttpStatusCode.Forbidden,
        'Not allowed to update this property',
        true,
      );
    }

    // update property status public
    const publishProperty = await prisma.properties.update({
      where: { id: id },
      data: { status },
      select: { id: true, agent_id: true },
    });

    return publishProperty;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      `Failed to update property status: ${(error as Error).message}`,
      false,
    );
  }
};
