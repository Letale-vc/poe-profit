import { App } from './app';

const PoeFlip = async () => {
  const initApp = await App.getInstance();
  await initApp.start();
};

Promise.resolve().then(() => PoeFlip());
