import { GET, api } from './base';

export const geoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getByCloudflare: builder.mutation<string, void>({
      query: () => ({
        url: 'https://www.cloudflare.com/cdn-cgi/trace',
        method: GET,
        responseHandler: async (response) => {
          const text = await response.text();
          return text;
        },
      }),
    }),
  }),
});

// response example:
// fl=80f263
// h=www.cloudflare.com
// ip=211.23.129.135
// ts=1735200815.846
// visit_scheme=https
// uag=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
// colo=TPE
// sliver=none
// http=http/3
// loc=TW
// tls=TLSv1.3
// sni=plaintext
// warp=off
// gateway=off
// rbi=off
// kex=X25519MLKEM768

export const { useGetByCloudflareMutation } = geoApi;
