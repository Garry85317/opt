import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type { ReduxState } from '../index';
import { refreshToken } from '../actions';
import { api_device_exchange_token } from '../../utils/apis';
import { ExchangeTokenResponse } from '../../utils/types';
import { API_UNAUTHORIZED_EVENT, dispatchErrorEvent } from '../../utils/events';

enum method {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const { GET, POST, PATCH, PUT, DELETE } = method;

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const { auth: { token } = { token: '' } } = getState() as ReduxState;
    // console.log({ token, headers });
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuthError: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // if (result.error && result.error.status === 404) {
    //   return { data: result.error };
    // }
    console.log(result.error);
    if (result.error && result.error.status === 401) {
      // if (refreshResult) result = await baseQuery(args, api, extraOptions)
      dispatchErrorEvent(result.error, API_UNAUTHORIZED_EVENT);
    }
    if (result.error && result.error.status === 400) {
      // try to get a new token
      const baseUrl = process.env.NEXT_PUBLIC_API_URL; // 'https://qa-api-oam.optoma.com';
      const url = `${baseUrl}/${api_device_exchange_token}`;
      // url: `${process.env.NEXT_PUBLIC_QA_API_URL}/${api_device_exchange_token}`, // localhost testing

      const state = api.getState() as ReduxState;
      const {
        account: { timezone: timezoneCode },
        organization: { address, city, state: orgState },
      } = state;
      const refreshResult = await baseQuery(
        {
          url,
          method: POST,
          body: {
            timezoneCode,
            // location,
            state: orgState,
            city,
            address,
          },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        // store the new token in the store or wherever you keep it
        await api.dispatch(refreshToken(refreshResult.data as ExchangeTokenResponse));
        result = await baseQuery(
          (args as FetchArgs).body
            ? {
                ...(args as FetchArgs),
                body: {
                  ...(args as FetchArgs).body,
                  csrfToken: (refreshResult.data as ExchangeTokenResponse).data.data.token,
                },
              }
            : args,
          api,
          {
            extraOptions,
          },
        );
      }
      // else {
      // refresh failed - do something like redirect to login or show a "retry" button
      // api.dispatch(loggedOut()); }
      // retry the initial query
      // console.log({ args, api, extraOptions }, refreshResult, result);
    }
    return result;
  };

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
  baseQuery: baseQueryWithAuthError,
  endpoints: () => ({}),
});
