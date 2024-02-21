import type { Action } from '@reduxjs/toolkit';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '@stores/reducers';
import { REHYDRATE } from 'redux-persist';

const baseQuery = fetchBaseQuery({
  // baseUrl: process.env.API_URL,
  baseUrl: 'https://docudash.net/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.accessToken;

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // console.log(result);
  if (result.error && result.error.status === 401) {
  }
  return result;
};
function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string;
  payload: RootState;
  err: unknown;
} {
  return action.type === REHYDRATE;
}
export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  // extractRehydrationInfo(action, { reducerPath }): any {
  //   if (isHydrateAction(action)) {
  //     // when persisting the api reducer
  //     if (action.key === 'key used with redux-persist') {
  //       return action.payload;
  //     }
  //     // When persisting the root reducer
  //     return action.payload[api.reducerPath];
  //   }
  // },
  tagTypes: ['Addresses', 'Contacts', 'Signatures'],
  endpoints: () => ({}),
});
