import { api, GET } from './base';
import { api_user_announcement } from '../../utils/apis';
import { PremiumResponse } from '../../utils/types';

export const premiumApi = api.injectEndpoints({
  endpoints: (builder) => ({
    premiumAnnounce: builder.query<PremiumResponse, void>({
      query: (body) => ({
        url: api_user_announcement,
        method: GET,
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { usePremiumAnnounceQuery } = premiumApi;
