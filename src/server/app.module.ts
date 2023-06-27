import { DynamicModule, Module } from '@nestjs/common';
import { ClientAppModule } from './client-app/client-app.module';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { NODE_ENV } from '../shared/constants/env';
import { resolve } from 'path';
import { ProfitDataModule } from './ProfitData/ProfitData.module';
import { PoeRequestsModule } from './PoeRequests/PoeRequests.module';
import { SettingsModule } from './Settings/Settings.module';

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
        ProfitDataModule,
        PoeRequestsModule,
        ClientAppModule,
        SettingsModule,
      ],
      controllers: [],
      providers: [],
    };
  }
}
