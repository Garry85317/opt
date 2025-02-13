import { api, GET, POST } from './base';
import {
  api_user_cloud,
  api_user_cloud_pair_google_classroom,
  api_user_cloud_pair_google_drive,
  api_user_cloud_pair_one_drive,
  api_user_cloud_unpair_google_classroom,
  api_user_cloud_unpair_google_drive,
  api_user_cloud_unpair_one_drive,
} from '../../utils/apis';
import { cloudPairResponse, userCloudResponse } from '../../utils/types';

export const cloudApi = api.injectEndpoints({
  endpoints: (builder) => ({
    userCloud: builder.query<userCloudResponse, void>({
      query: (body) => ({
        url: api_user_cloud,
        method: GET,
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
        }
      },
    }),
    pairGoogleDrive: builder.query<cloudPairResponse, void>({
      query: (body) => ({
        url: api_user_cloud_pair_google_drive,
        method: GET,
        body,
      }),
    }),
    pairGoogleClassroom: builder.query<cloudPairResponse, void>({
      query: (body) => ({
        url: api_user_cloud_pair_google_classroom,
        method: GET,
        body,
      }),
    }),
    pairOneDrive: builder.query<cloudPairResponse, void>({
      query: (body) => ({
        url: api_user_cloud_pair_one_drive,
        method: GET,
        body,
      }),
    }),
    unpairGoogleDrive: builder.mutation<void, void>({
      query: (body) => ({
        url: api_user_cloud_unpair_google_drive,
        method: POST,
        body,
        responseHandler: (response: { text: () => any }) => response.text(),
      }),
    }),
    unpairGoogleClassroom: builder.mutation<void, void>({
      query: (body) => ({
        url: api_user_cloud_unpair_google_classroom,
        method: POST,
        body,
        responseHandler: (response: { text: () => any }) => response.text(),
      }),
    }),
    unpairOneDrive: builder.mutation<void, void>({
      query: (body) => ({
        url: api_user_cloud_unpair_one_drive,
        method: POST,
        body,
        responseHandler: (response: { text: () => any }) => response.text(),
      }),
    }),
  }),
});

export const {
  useUserCloudQuery,
  useLazyPairGoogleDriveQuery,
  useLazyPairGoogleClassroomQuery,
  useLazyPairOneDriveQuery,
  useUnpairGoogleDriveMutation,
  useUnpairGoogleClassroomMutation,
  useUnpairOneDriveMutation,
} = cloudApi;
