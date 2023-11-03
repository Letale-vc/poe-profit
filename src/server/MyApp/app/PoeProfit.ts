import { App } from './app';

export const ProfitApp = App.getInstance();

async function PoeProfitInit() {
  if (!ProfitApp.isInitApp) {
    await ProfitApp.init();
    void ProfitApp.start();
  }
}
