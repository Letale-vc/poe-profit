import { z } from 'zod';

export const newRequestSchema = z.object({
  itemBuying: z.string(),
  itemSelling: z.string(),
});

export type NewRequestType = z.infer<typeof newRequestSchema>;

export const updateRequestSchema = z.object({
  itemBuying: z.string(),
  itemSelling: z.string(),
  uuid: z.string(),
});

export type UpdateRequestType = z.infer<typeof updateRequestSchema>;

export const deleteRequestSchema = z.string().uuid();

export type DeleteRequestType = z.infer<typeof deleteRequestSchema>;
