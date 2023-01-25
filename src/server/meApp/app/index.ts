import { App } from './app';

const app = new App();
const initApp = async () => {
  await app.init();
  await app.start();
};

initApp();
