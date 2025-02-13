import {
  api_notification_flag,
  api_notification_flag_for_OMS_trial_extension,
  api_OMS_license_notification,
} from '../../utils/apis';
import type { NotificationState } from '../slices/notification';
import { api, GET, POST } from './base';

interface NotificationFlagResponse {
  data: NotificationState['omsLicenseNotificationFlag'];
  version: string;
}

interface OMSTrialExtensionNotificationFlagResponse {
  data: NotificationState['omsTrialExtensionNotification'];
  version: string;
}

interface OMSlicenseNotificationResponse {
  data: NotificationState['omsLicenseNotification'];
  version: string;
}

interface UpdateNotificationFlagResponse {
  data: string;
  error?: string;
  version: string;
}

interface UpsertNotificationFlagRequest {
  key: string;
}

interface updateOMSTrialExtensionRequest {
  isAgreed: boolean;
}

export const notificationApi = api
  .enhanceEndpoints({
    addTagTypes: ['Notification', 'Notification-OMS-Trial-Extension', 'OMS-License-Notification'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNotificationFlag: builder.query<NotificationFlagResponse, void>({
        query: () => ({
          url: api_notification_flag,
          method: GET,
        }),
        providesTags: ['Notification'],
      }),
      upsertNotificationFlag: builder.mutation<
        UpdateNotificationFlagResponse,
        UpsertNotificationFlagRequest
      >({
        query: (body) => ({
          url: api_notification_flag,
          method: POST,
          body,
        }),
        invalidatesTags: ['Notification'],
      }),
      getOMSTrialExtensionNotificationFlag: builder.query<
        OMSTrialExtensionNotificationFlagResponse,
        void
      >({
        query: () => ({
          url: api_notification_flag_for_OMS_trial_extension,
          method: GET,
        }),
        providesTags: ['Notification-OMS-Trial-Extension'],
      }),
      updateOMSTrialExtensionNotificationFlag: builder.mutation<
        UpdateNotificationFlagResponse,
        updateOMSTrialExtensionRequest
      >({
        query: (body) => ({
          url: api_notification_flag_for_OMS_trial_extension,
          method: POST,
          body,
        }),
        invalidatesTags: ['Notification-OMS-Trial-Extension'],
      }),
      getOMSlicenseNotification: builder.query<OMSlicenseNotificationResponse, void>({
        query: () => ({
          url: api_OMS_license_notification,
          method: GET,
        }),
        providesTags: ['OMS-License-Notification'],
      }),
    }),
  });

export const {
  useLazyGetNotificationFlagQuery,
  useUpsertNotificationFlagMutation,
  useLazyGetOMSTrialExtensionNotificationFlagQuery,
  useUpdateOMSTrialExtensionNotificationFlagMutation,
  useLazyGetOMSlicenseNotificationQuery,
} = notificationApi;
