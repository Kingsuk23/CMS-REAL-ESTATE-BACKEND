import { Properties } from '@prisma/client';

/** Type for creating new property listings */
export type propertyListingType = Omit<
  Properties,
  'updated_at' | 'created_at' | 'id' | 'status' | ' agent_id'
>;

/** Type for updating existing properties */
export interface propertyUpdateType extends propertyListingType {
  id: string;
}
