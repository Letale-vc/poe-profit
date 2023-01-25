import { DynamicModule, Module } from '@nestjs/common';
import { ClientAppModule } from './client-app/clieant-app.module';
import { FlipQueriesModule } from './flip-queries/flip-queries-module';
import { FlipDataModule } from './flip-data/flip-data.module';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { NODE_ENV } from '../shared/constants/env';
import { resolve } from 'path';

// eslint-disable-next-line @next/next/no-assign-module-variable
declare const module: any;

@Module({})
export class AppModule {
  public static initialize(): DynamicModule {
    const renderModule =
      module.hot?.data?.renderModule ??
      RenderModule.forRootAsync(
        Next({
          dev: NODE_ENV === 'development',
          dir: resolve(__dirname, '..', '..'),
        }),
        {
          viewsDir: null,
          passthrough404: true,
        },
      );

    if (module.hot) {
      module.hot.dispose((data: any) => {
        data.renderModule = renderModule;
      });
    }

    return {
      module: AppModule,
      imports: [
        renderModule,
        FlipDataModule,
        FlipQueriesModule,
        ClientAppModule,
      ],
      controllers: [],
      providers: [],
    };
  }
}
