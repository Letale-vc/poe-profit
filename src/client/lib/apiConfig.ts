import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { PoeFlipDataType } from '../../shared/types/flipObjectTypes';
import {
  FlipQueriesType,
  NewFlipQueriesType,
} from '../../shared/types/FlipQueriesTypes';
import { envAwareUrl } from '../../shared/utils/fetch';

// interface ErrorType {
//   data: { statusCode: number; message: string[]; error: string };
// }

// as unknown as BaseQueryFn<string | FetchArgs, unknown, ErrorType>,

// const createApi = buildCreateApi(
//   coreModule(),
//   reactHooksModule({ unstable__sideEffectsInRender: true }),
// );
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
  tagTypes: ['flipQueries', 'flip-data'],
  endpoints: (builder) => ({
    getPoeFlipData: builder.query<PoeFlipDataType, void>({
      query: () => ({ url: 'flipData' }),
    }),
    getPoeFlipQuery: builder.query<FlipQueriesType[], void>({
      query: () => ({
        url: 'flipQueries',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                (data) => ({ type: 'flipQueries', ...data } as const),
              ),
            ]
          : [],
    }),
    deletePoeFlipQuery: builder.mutation<void, FlipQueriesType>({
      query: (arg) => ({
        url: 'flipQueries',
        method: 'DELETE',
        body: arg,
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'flipQueries', ...data },
      ],
    }),
    addFlipQuery: builder.mutation<void, NewFlipQueriesType>({
      query: (arg) => ({
        url: 'flipQueries',
        method: 'POST',
        body: arg,
      }),
      invalidatesTags: () => [{ type: 'flipQueries' }],
    }),
    editFlipQuery: builder.mutation<void, FlipQueriesType>({
      query: (arg) => ({
        url: 'flipQueries',
        method: 'PUT',
        body: arg,
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'flipQueries', ...data },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useEditFlipQueryMutation,
  useGetPoeFlipQueryQuery,
  useDeletePoeFlipQueryMutation,
  useAddFlipQueryMutation,
  useGetPoeFlipDataQuery,
  // util: { getRunningQueriesThunk },
} = flipApi;
// export endpoints for use in SSR
export const { getPoeFlipData, getPoeFlipQuery } = flipApi.endpoints;
