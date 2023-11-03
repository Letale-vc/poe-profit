import { z } from 'zod';
import {
  deleteRequestSchema,
  newRequestSchema,
  updateRequestSchema,
} from '~/server/MyApp/FileManagers';
import { ProfitApp } from '~/server/MyApp/app/PoeProfit';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { dataTypesNameSchema, TYPE_DATA } from './profitData';

export const requestDataRouter = createTRPCRouter({
  get: publicProcedure.input(dataTypesNameSchema).query(async (arg) => {
    return ProfitApp.dataUpdaters
      .find((el) => el.key === TYPE_DATA[arg.input])
      ?.requestManager.getAll();
  }),

  create: publicProcedure
    .input(
      z.object({
        type: dataTypesNameSchema,
        newRequest: newRequestSchema,
      }),
    )
    .mutation(async ({ input }) => {
      if (!ProfitApp.isInitApp) {
        await ProfitApp.init();
      }
      await ProfitApp.dataUpdaters
        .find((el) => el.key === TYPE_DATA[input.type])
        ?.requestManager.add(input.newRequest);
    }),

  update: publicProcedure
    .input(
      z.object({
        type: dataTypesNameSchema,
        newRequest: updateRequestSchema,
      }),
    )
    .mutation(async ({ input }) => {
      if (!ProfitApp.isInitApp) {
        await ProfitApp.init();
      }
      await ProfitApp.dataUpdaters
        .find((el) => el.key === TYPE_DATA[input.type])
        ?.requestManager.update(input.newRequest);
    }),
  remove: publicProcedure
    .input(
      z.object({
        type: dataTypesNameSchema,
        request: deleteRequestSchema,
      }),
    )
    .mutation(async ({ input }) => {
      if (!ProfitApp.isInitApp) {
        await ProfitApp.init();
      }
      await ProfitApp.dataUpdaters
        .find((el) => el.key === TYPE_DATA[input.type])
        ?.requestManager.remove(input.request);
    }),
});
