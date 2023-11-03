import { createTRPCRouter } from '~/server/api/trpc';
import { profitDataRouter } from './routers/profitData';
import { settingsRout } from './routers/settings';
import { requestDataRouter } from './routers/requestData';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  profitData: profitDataRouter,
  settings: settingsRout,
  requestData: requestDataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
