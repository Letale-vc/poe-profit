import { z } from 'zod';
import { FILE_NAMES } from '~/server/MyApp/Helpers';
import { ProfitApp } from '~/server/MyApp/app/PoeProfit';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const TYPE_DATA = {
  flipData: FILE_NAMES.FLIP_DATA,
  expGemsData: FILE_NAMES.EXP_GEMS_DATA,
} as const;
const [firstKey, ...otherKey] = Object.keys(
  TYPE_DATA,
) as (keyof typeof TYPE_DATA)[];
export type DataNamesType = keyof typeof TYPE_DATA;

export const dataTypesNameSchema = z.enum([firstKey, ...otherKey]);

export const profitDataRouter = createTRPCRouter({
  get: publicProcedure.input(dataTypesNameSchema).query(async (arg) => {
    return ProfitApp.dataUpdaters
      .find((el) => el.key === TYPE_DATA[arg.input])
      ?.fileDataManager.getDataAndTimeInfo();
  }),
});
