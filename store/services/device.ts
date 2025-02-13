import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import { api, GET, POST } from './base';
import {
  api_device_exchange_token,
  api_device_get_role,
  api_device_notify_create_account,
  api_device_update_role,
  api_device_check_sn,
  api_device_step_1,
  api_device_pair_status,
  api_device_pincode,
  api_device_step_2,
  api_device_step_3,
  api_device_update,
  api_device_cancel_pair,
  api_device_list_all,
  api_device_delete,
  api_gatewayDevice_delete,
  api_device_get_expiry,
} from '../../utils/apis';
import {
  OmsAccountInfo,
  ExchangeTokenResponse,
  DeviceResponse,
  StepOneResponse,
  PincodeResponse,
  PairResponse,
  CheckSNResponse,
  StepTwoResponse,
  DeleteDeviceRequest,
  GetExpiryResponse,
  Sort,
  DeleteGatewayDeviceRequest,
} from '../../utils/types';
import type { ReduxState } from '..';
import { deleteDevices } from '../actions';

const baseUrl = process.env.NEXT_PUBLIC_API_URL; // 'https://qa-api-oam.optoma.com';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // const projectId = selectProjectId(api.getState() as RootState)

  const state = api.getState();
  // gracefully handle scenarios where data to generate the URL is missing
  // if (!projectId) {
  //   return {
  //     error: {
  //       status: 400,
  //       statusText: 'Bad Request',
  //       data: 'No project ID received',
  //     },
  //   }
  // }

  const urlEnd = typeof args === 'string' ? args : args.url;
  // construct a dynamically generated portion of the url
  const adjustedUrl = `${urlEnd}`;
  const adjustedArgs = typeof args === 'string' ? adjustedUrl : { ...args, url: adjustedUrl };
  // provide the amended url and other params to the raw base query
  return rawBaseQuery(adjustedArgs, api, extraOptions);
};

type ExchangeTokenRequest = {
  omsAccountInfo: OmsAccountInfo;
};

type GetRoleRequest = {
  idList: string[];
  csrfToken?: string;
};

type NotifyRequest = {
  omsAccountInfo: OmsAccountInfo;
  csrfToken?: string;
};

type UpdateRoleRequest = {
  oamAccountId: string;
  omsRoleId: string; // '1', '2', '3', '4'
  csrfToken?: string;
};

type CheckSNRequest = {
  csrfToken?: string;
  deviceSN: string;
};

type StepRequest = {
  csrfToken?: string;
  deviceSNs: string[];
};

type StepFinalRequest = {
  csrfToken?: string;
  devices: {
    deviceSN: string;
    deviceAliasName: string;
    deviceDescription: string;
    groupIds?: string[];
    locationInfo?: {
      locationId: string;
      cityId: string;
      buildingId: string;
      floorId: string;
      roomId: string;
    };
  }[];
};

type UpdateDeviceRequest = {
  csrfToken?: string;
  deviceId: string;
  deviceName: string;
  description?: string;
  locationKeyPack?: {
    locationId: string;
    cityId: string;
    buildingId: string;
    floorId: string;
    roomId: string;
  };
  groupIds?: string[];
};

const headers = {
  // Authorization: ...
};

export const deviceApi = api
  .enhanceEndpoints({
    // baseQuery: dynamicBaseQuery,
    addTagTypes: ['Token', 'Device'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      exchangeToken: builder.query<ExchangeTokenResponse, ExchangeTokenRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              account: { timezone: timezoneCode },
              organization: { address, city, state: orgState },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_exchange_token}`,
              // url: `${process.env.NEXT_PUBLIC_QA_API_URL}/${api_device_exchange_token}`, // localhost testing
              method: POST,
              headers,
              body: {
                timezoneCode,
                // location,
                state: orgState,
                city,
                address,
                ...params,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as ExchangeTokenResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
        providesTags: () => ['Token'],
      }),
      getExpiry: builder.mutation<GetExpiryResponse, void>({
        async queryFn(params, { getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token },
            } = state;
            const data = await baseQuery({
              url: `${baseUrl}/${api_device_get_expiry}`,
              method: GET,
              headers,
              params: { token },
            });
            // Return the result in an object with a `data` field
            return { data: (data.data || data.error) as GetExpiryResponse }; //{ data: data.data };
          } catch (error) {
            console.log(error);
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
      getDevices: builder.query<
        DeviceResponse,
        {
          accountId?: string;
          search?: string;
          sortBy?: string;
          sort?: Sort.ASC | Sort.DESC;
          offset?: number;
          limit?: number;
        }
      >({
        async queryFn(
          { accountId, search, sortBy, sort = 'asc', offset = 0, limit = 10 },
          { signal, dispatch, getState },
          extraOptions,
          baseQuery,
        ) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_list_all}`,
              method: POST,
              headers,
              body: {
                csrfToken,
                accountId,
                search,
                sortBy,
                sort,
                offset,
                limit,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as DeviceResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
        providesTags: (result, error, arg) => [
          ...(result?.data?.data
            ? result.data.data.map((device) => ({
                type: 'Device' as const,
                id: device.id,
              }))
            : []),
          'Device',
          { type: 'Device', id: 'LIST' },
        ],
      }),
      deleteDevices: builder.mutation<DeviceResponse, DeleteDeviceRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_delete}`,
              method: POST,
              headers,
              body: { csrfToken, deviceIds: params.deviceIds },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as DeviceResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            if (data.data.isSuccess) dispatch(deleteDevices(body.deviceIds));
          } catch (err) {
            console.log(err);
          }
        },
        invalidatesTags: (result, error, params) => [{ type: 'Device', id: 'LIST' }], //params.deviceIds.map((id) => ({ type: 'Device', id })),
      }),
      deleteGatewayDevices: builder.mutation<DeviceResponse, DeleteGatewayDeviceRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            const device = await baseQuery({
              url: `${baseUrl}/${api_gatewayDevice_delete}`,
              method: POST,
              headers,
              body: {
                csrfToken,
                gatewayId: params.gatewayId,
                gatewayLocalIp: params.gatewayLocalIp,
                ip: params.ip,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as DeviceResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
          try {
            await queryFulfilled;
            //有些許時間差所以延遲10秒再拿一次GetDevices的資料
            await new Promise((resolve) => {
              setTimeout(resolve, 30000);
            });
            dispatch(deviceApi.util.invalidateTags([{ type: 'Device', id: 'LIST' }]));
          } catch (err) {
            console.error('Error deleting gateway devices:', err);
          }
        },
        invalidatesTags: (result, error, params) => [{ type: 'Device', id: 'LIST' }],
      }),
      getRole: builder.mutation<ExchangeTokenResponse, GetRoleRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_get_role}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as ExchangeTokenResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
      // TODO response type
      notifyCreateAccount: builder.mutation<ExchangeTokenResponse, NotifyRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_notify_create_account}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as ExchangeTokenResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
        invalidatesTags: () => ['Token'],
      }),
      // TODO response type
      updateRole: builder.mutation<ExchangeTokenResponse, UpdateRoleRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_update_role}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as ExchangeTokenResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
      checkSN: builder.mutation<CheckSNResponse, CheckSNRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_check_sn}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: (device.data || device.error) as CheckSNResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
      stepOne: builder.mutation<StepOneResponse, StepRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const result = await baseQuery({
              url: `${baseUrl}/${api_device_step_1}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            if (result.error) {
              return {
                data: {
                  data: {
                    data: [],
                    isSuccess: false,
                    errorCode: 400,
                    errorInfo: (result.error.data as { message: string }).message,
                  },
                  version: (result.error.data as { version: string }).version,
                } as StepOneResponse,
              };
            }
            // Return the result in an object with a `data` field
            return { data: result.data as StepOneResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
      pairStatus: builder.mutation<PairResponse, StepRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_pair_status}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as PairResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
      checkPincode: builder.mutation<PincodeResponse, CheckSNRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_pincode}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as PincodeResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
      stepTwo: builder.mutation<StepTwoResponse, StepRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_step_2}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as StepTwoResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
      stepThree: builder.mutation<ExchangeTokenResponse, StepFinalRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
              organization: { location, city },
            } = state;
            // TODO locationInfo
            // const locationInfo = {
            //   locationId: 'string',
            //   cityId: 'string',
            //   buildingId: 'string',
            //   floorId: 'string',
            //   roomId: 'string',
            // };
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_step_3}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as ExchangeTokenResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            // dispatch(deviceApi.util.updateQueryData()));
          } catch (err) {
            console.log(err);
          }
        },
        invalidatesTags: (result, error, arg) => ['Device'], //[{ type: 'Device', id: 'LIST' }],
      }),
      updateDevice: builder.mutation<ExchangeTokenResponse, UpdateDeviceRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_update}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as ExchangeTokenResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
        invalidatesTags: (result, error, params) => [{ type: 'Device', id: params.deviceId }],
      }),
      cancelPair: builder.mutation<ExchangeTokenResponse, StepRequest>({
        async queryFn(params, { signal, dispatch, getState }, extraOptions, baseQuery) {
          try {
            const state = getState() as ReduxState;
            const {
              devices: { token: csrfToken },
            } = state;
            // TODO use env base url
            const device = await baseQuery({
              url: `${baseUrl}/${api_device_cancel_pair}`,
              method: POST,
              headers,
              body: {
                ...params,
                csrfToken,
              },
            });
            // Return the result in an object with a `data` field
            return { data: device.data as ExchangeTokenResponse };
          } catch (error) {
            // Catch any errors and return them as an object with an `error` field
            return { error: error as FetchBaseQueryError };
          }
        },
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            console.log(err);
          }
        },
      }),
    }),
  });

export const {
  useLazyExchangeTokenQuery,
  useGetExpiryMutation,
  useLazyGetDevicesQuery,
  useDeleteDevicesMutation,
  useDeleteGatewayDevicesMutation,
  useGetRoleMutation,
  useNotifyCreateAccountMutation,
  useUpdateRoleMutation,
  useCheckSNMutation,
  useStepOneMutation,
  usePairStatusMutation,
  useCheckPincodeMutation,
  useStepTwoMutation,
  useStepThreeMutation,
  useUpdateDeviceMutation,
  useCancelPairMutation,
} = deviceApi;
