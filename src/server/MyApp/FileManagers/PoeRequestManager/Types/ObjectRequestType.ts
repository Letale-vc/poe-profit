import { requestBodyTypeSchema } from 'poe-trade-fetch';
import { z } from 'zod';

export const ItemInRequestSchema = z.object({
  name: z.string(),
  queryId: z.string(),
  url: z.string(),
  tradeRequest: requestBodyTypeSchema,
});

export const ObjectRequestSchema = z.object({
  itemBuying: ItemInRequestSchema,
  itemSelling: ItemInRequestSchema,
  uuid: z.string(),
});

export type ItemInRequestType = z.infer<typeof ItemInRequestSchema>;
export type ObjectRequestType = z.infer<typeof ObjectRequestSchema>;
