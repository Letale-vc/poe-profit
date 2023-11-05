import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ProfitApp } from '~/server/MyApp';
import { updateSettingsSchema } from '~/server/MyApp/FileManagers';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const settingsRout = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        pin: z.string(),
      }),
    )
    .query(async ({ input }) => {
      if (input.pin !== process.env.PIN) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      return ProfitApp.settings.loadFile();
    }),
  updateSettings: publicProcedure
    .input(z.object({ pin: z.string(), settings: updateSettingsSchema }))
    .mutation(async ({ input }) => {
      if (input.pin !== process.env.PIN) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      const { ProfitApp } = await import('~/server/MyApp/app/PoeProfit');
      if (!ProfitApp.isInitApp) {
        await ProfitApp.init();
      }
      return await ProfitApp.settings.mutate(input.settings);
    }),
});
