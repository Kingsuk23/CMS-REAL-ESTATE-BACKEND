import { Inquiries } from '@prisma/client';

export type inquiriesType = Omit<Inquiries, 'id' | 'created_at' | 'updated_at'>;
