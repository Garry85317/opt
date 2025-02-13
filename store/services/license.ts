import { api, GET } from './base';
import { api_license_oms_info, api_license_oss_info } from '../../utils/apis';
import { OMSInfoResponse, OSSInfoResponse } from '../../utils/types';

export const licenseApi = api
  .enhanceEndpoints({
    addTagTypes: ['OMS-License', 'OSS-License'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      omsInfo: builder.query<OMSInfoResponse, void>({
        query: (body) => ({
          url: api_license_oms_info,
          method: GET,
          body,
        }),
        providesTags: ['OMS-License'],
      }),
      ossInfo: builder.query<OSSInfoResponse, void>({
        query: (body) => ({
          url: api_license_oss_info,
          method: GET,
          body,
        }),
        providesTags: ['OSS-License'],
      }),
    }),
  });

export const { useOmsInfoQuery, useLazyOmsInfoQuery, useOssInfoQuery, useLazyOssInfoQuery } =
  licenseApi;
