export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ProfitApp } = await import('./server/MyApp/app/PoeProfit');
    await ProfitApp.init();
    void ProfitApp.start();
  }
}
