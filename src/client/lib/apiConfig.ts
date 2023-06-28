import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import {
  ObjectRequestType,
  NewRequestType,
  UpdateRequestType,
  SettingsType,
  UpdateSettingsType,
} from '../../MyApp/FileManagers';

import { apiRouts } from '../../shared/constants/ApiRouts';
import { RequestAndDataTypeNamesTypes } from '../../shared/constants/RequestAndDataType';
import { DataToClientType } from '../../shared/types/ObjectDataTypes';

import { envAwareUrl } from '../../shared/utils/fetch';

export const flipApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: envAwareUrl('/api'),
  }),
  // eslint-disable-next-line consistent-return
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['PoeRequests', 'flip-data', 'settings'],
  endpoints: (builder) => ({
    getData: builder.query<DataToClientType, RequestAndDataTypeNamesTypes>({
      query: (arg) => ({ url: `${apiRouts.Data}?type=${arg}` }),
    }),
    getSettings: builder.query<SettingsType, void | string>({
      query: (arg) => ({
        url: apiRouts.settings,
        headers: arg ? { 'X-Real-IP': arg } : {},
      }),
      providesTags: ['settings'],
    }),

    changeSettings: builder.mutation<SettingsType, UpdateSettingsType>({
      query: (arg) => ({ url: apiRouts.settings, method: 'PUT', body: arg }),
      invalidatesTags: ['settings'],
    }),

    getPoeRequestsData: builder.query<
      ObjectRequestType[],
      RequestAndDataTypeNamesTypes
    >({
      query: (arg) => ({
        url: `${apiRouts.PoeRequests}?type=${arg}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                (data) => ({ type: 'PoeRequests', ...data } as const),
              ),
            ]
          : [],
    }),
    deletePoeRequest: builder.mutation<
      void,
      { request: ObjectRequestType; requestType: RequestAndDataTypeNamesTypes }
    >({
      query: (arg) => ({
        url: `${apiRouts.PoeRequests}?type=${arg.requestType}`,
        method: 'DELETE',
        body: arg.request,
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'PoeRequests', ...data },
      ],
    }),
    addPoeRequest: builder.mutation<
      void,
      { request: NewRequestType; requestType: RequestAndDataTypeNamesTypes }
    >({
      query: (arg) => ({
        url: `${apiRouts.PoeRequests}?type=${arg.requestType}`,
        method: 'POST',
        body: arg.request,
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'PoeRequests', ...data },
      ],
    }),
    editPoeRequest: builder.mutation<
      void,
      { request: UpdateRequestType; requestType: RequestAndDataTypeNamesTypes }
    >({
      query: (arg) => ({
        url: `${apiRouts.PoeRequests}?type=${arg.requestType}`,
        method: 'PUT',
        body: arg.request,
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'PoeRequests', ...data },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetDataQuery,
  useGetSettingsQuery,
  useChangeSettingsMutation,
  useGetPoeRequestsDataQuery,
  useEditPoeRequestMutation,
  useDeletePoeRequestMutation,
  useAddPoeRequestMutation,
  // util: { getRunningQueriesThunk },
} = flipApi;
// export endpoints for use in SSR
export const { getData, getPoeRequestsData, getSettings } = flipApi.endpoints;
