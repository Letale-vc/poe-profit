import { ProfitApp } from '~/server/MyApp';
import { updateSettingsSchema } from '~/server/MyApp/FileManagers';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
export const settingsRout = createTRPCRouter({
  get: publicProcedure.query(() => {
    return ProfitApp.settings.loadFile();
  }),
  updateSettings: publicProcedure
    .input(updateSettingsSchema)
    .mutation(async ({ input }) => {
      const { ProfitApp } = await import('~/server/MyApp/app/PoeProfit');
      if (!ProfitApp.isInitApp) {
        await ProfitApp.init();
      }
      await ProfitApp.settings.mutate(input);
    }),
});
