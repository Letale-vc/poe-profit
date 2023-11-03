import { ProfitApp } from '~/server/MyApp';
import { updateSettingsSchema } from '~/server/MyApp/FileManagers';
import { createTRPCRouter, forbiddenProcedure } from '~/server/api/trpc';
export const settingsRout = createTRPCRouter({
  get: forbiddenProcedure.query(async () => {
    return await ProfitApp.settings.loadFile();
  }),
  updateSettings: forbiddenProcedure
    .input(updateSettingsSchema)
    .mutation(async ({ input }) => {
      const { ProfitApp } = await import('~/server/MyApp/app/PoeProfit');
      if (!ProfitApp.isInitApp) {
        await ProfitApp.init();
      }
      await ProfitApp.settings.mutate(input);
    }),
});
