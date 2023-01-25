import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { resolve } from 'path';
import { isMainThread, Worker } from 'worker_threads';
import { NODE_ENV, PORT } from '../shared/constants/env';
import { AppModule } from './app.module';
// eslint-disable-next-line @next/next/no-assign-module-variable
declare const module: any;

async function bootstrap() {
  if (isMainThread) {
    if (NODE_ENV === 'production') {
      const pathFiles = resolve(__dirname, 'meApp', 'app', 'index.js');
      const worker = new Worker(pathFiles);
    } else {
      import('./meApp/app/index');
    }
  }
  const app = await NestFactory.create(AppModule.initialize());
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false }));
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
