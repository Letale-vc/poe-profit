import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { isMainThread } from 'worker_threads';
import { NODE_ENV, PORT } from '../shared/constants/env';
import { AppModule } from './app.module';

// eslint-disable-next-line @next/next/no-assign-module-variable
declare const module: any;

async function bootstrap() {
  if (isMainThread) {
    if (NODE_ENV === 'production') {
      import('./worker');
    } else {
      import('../MyApp');
    }
  }

  const app = await NestFactory.create(AppModule.initialize());
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  // app.setGlobalPrefix('api', { exclude: Object.keys(apiRouts) });
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false }));
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
