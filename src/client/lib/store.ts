import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { flipApi } from './apiConfig';

export const makeStore = () =>
  configureStore({
    reducer: {
      [flipApi.reducerPath]: flipApi.reducer,
    },
    middleware: (gDM) => gDM().concat(flipApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppChunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const wrapper = createWrapper<AppStore>(makeStore);
