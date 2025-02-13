import axios, { AxiosResponse } from 'axios';
import { IUserInfo, userCloudResponse, PremiumResponse } from './types';

export interface Response<T = any> {
  requestId: string;
  data: T;
  errorMessage: string;
  status: 'success' | 'failed';
  code: number;
}

const transformResponse = [
  (data: any) => data as Response,
  ...(axios.defaults.transformResponse as []),
];

const postConfig = {
  transformResponse,
  headers: {
    'x-api-key': 'ca9f2b5952d064e178f55503b06eb5f8a98df1a56dce84e5a5f4670846f475f9',
  },
};

const getAccessToken = (token?: string) =>
  token ??
  (typeof window !== undefined ? localStorage.getItem('accessToken') : 'defaultAccessToken');

const postConfigOnlyToken = (token?: string) => {
  const accessToken = getAccessToken(token);
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    transformResponse,
  };
};

const server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export function paramsToUrl(params: Record<string, unknown>) {
  let url = '?';
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        url += `${url.slice(-1) !== '?' ? '&' : ''}${key}=${value}`;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => (url += `${url.slice(-1) !== '?' ? '&' : ''}${key}=${item}`));
      }
    });
  }
  return url;
}

// Auth
export const api_oam_auth_login = 'web/auth/login';
export const api_oam_auth_qrcode_login = 'web/auth/qr-code/login';
export const api_oam_auth_passport_qrcode = 'web/auth/passport/qrcode';
export const api_oam_auth_redirect = 'web/auth/redirect';
export const api_oam_auth_logout = 'web/auth/logout';
export const api_auth_session = '/web/auth/session';
export const api_oam_exchange_token = '/web/auth/exchange-token';
export const api_oam_exchange_code = '/web/auth/exchange-code';
// note: being replace by api_initial_profile_am_apple_email
//// export const api_am_confirm_email = '/web/user/confirm-apple-email';
export const api_initial_profile_am_apple_email = '/web/user/initial-profile-am-apple-email';
export const api_am_confirm_age = '/web/user/confirm-age';
export const api_oam_auth_get_qrcode_id = '/web/auth/ws/identify';

// User
export const api_user_first_login = '/web/user/initial-profile';
export const api_user_sign_up = 'web/user/sign-up';
export const api_user_register_send_confirm = 'web/user/register/send_confirm';
export const api_user_forgot_password = 'web/user/password/forget/send_confirm';
export const api_user_password_forget_confirm = 'web/user/password/forget/confirm';
export const api_change_password = 'web/user/password/change';
export const api_user_token_email = 'web/user/token/email';
export const api_user_register_confirm = 'web/user/register/confirm';
export const api_user_register_apple_confirm = 'web/user/register/apple/confirm';
export const api_user_change = 'web/user/password/change';
export const api_user = 'web/user';
export const api_user_exists = 'web/user/exists';
export const api_user_announcement = 'web/user/announcement';
export const api_user_guardian_confirm = 'web/user/register/guardian_confirm_status';
export const api_user_send_guardian_confirm = 'web/user/register/send_guardian_confirm';
// note: being replace by api_initial_profile_am_age_acitve
////export const api_user_age_acitve = '/web/user/age/activate';
export const api_initial_profile_am_age_active = '/web/user/initial-profile-am-age-activate';
export const api_user_age_deacitve = '/web/user/age/deactivate';

//user/cloud
export const api_user_cloud = 'user/cloud';
export const api_user_cloud_pair_google_drive = 'user/cloud/connect/google-drive';
export const api_user_cloud_pair_google_classroom = 'user/cloud/connect/google-classroom';
export const api_user_cloud_pair_one_drive = 'user/cloud/connect/one-drive';
export const api_user_cloud_unpair_google_drive = 'user/cloud/unpair/google-drive';
export const api_user_cloud_unpair_google_classroom = 'user/cloud/unpair/google-classroom';
export const api_user_cloud_unpair_one_drive = 'user/cloud/unpair/onedrive';

// Organization
export const api_organization_info = 'web/organizations';
export const api_organizations_users_password = '/web/organizations/user/password';
export const api_organization_user = 'web/organizations/user';
export const api_organization_user_role = 'web/organizations/user/role';
export const api_organization_user_info = 'web/organizations/user/info';
export const api_organizations_user_send_invitation = 'web/organizations/user/send_invitation';
export const api_organization_user_import = 'web/organizations/user/import';
export const api_auth_sso_sign_in = 'web/sso/signIn';
export const api_organization_updateLatestInfo = 'web/organizations/updateLatestInfo';

// Proxy
export const api_device_exchange_token = 'web/proxy/exchangeToken';
export const api_device_get_expiry = 'web/proxy/getExpiry';
export const api_device_list_all = 'web/proxy/getDevices';
export const api_device_oam_list_all = 'web/proxy/getOAMDevices';
export const api_device_delete = 'web/proxy/deleteDevices';
export const api_gatewayDevice_delete = 'web/proxy/deleteGatewayDevices';
export const api_device_get_role = 'web/proxy/getUserRole';
export const api_device_notify_create_account = 'web/proxy/notifyOMSCreateAccount';
export const api_device_update_role = 'web/proxy/updateUserRole';
export const api_device_check_sn = 'web/proxy/checkSN';
export const api_device_step_1 = 'web/proxy/submitStep1';
export const api_device_pair_status = 'web/proxy/getDevicePairStatus';
export const api_device_pincode = 'web/proxy/checkPincode';
export const api_device_step_2 = 'web/proxy/submitStep2';
export const api_device_step_3 = 'web/proxy/submitStep3';
export const api_device_update = 'web/proxy/updateDevice';
export const api_device_cancel_pair = 'web/proxy/cancelPairProcess';

// License
export const api_license_oms_info = 'web/user/license/oms-info';
export const api_license_oss_info = 'web/user/license/oss-info';

// Notification
export const api_notification_flag = 'web/notification/notificationFlag';
export const api_notification_flag_for_OMS_trial_extension =
  'web/notification/notificationFlag-oms-trial-extension';
export const api_OMS_license_notification = 'web/notification/oms-license-notification';

export const apiUpdateUserRole = async (
  data: {
    id: string;
    oamRole: string;
    omsRole: string;
    ossRole?: string;
  },
  token?: string,
) => {
  try {
    return await server.post<any, AxiosResponse<Response, any>>(
      api_organization_user_role,
      data,
      postConfigOnlyToken(token),
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiOrganizationsUserSendInvitation = async (data: { email: string }) => {
  try {
    return await server.post<any, AxiosResponse<Response, any>>(
      api_organizations_user_send_invitation,
      data,
      {
        transformResponse,
      },
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiOrganizationsUsersPassword = async (data: { password: string; token: string }) => {
  try {
    return await server.post<any, AxiosResponse<Response, any>>(
      api_organizations_users_password,
      { newPassword: data.password },
      {
        params: {
          token: data.token,
        },
        transformResponse,
      },
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiPasswordForgetConfirm = async (data: { password: string; token: string }) => {
  try {
    return await server.post<any, AxiosResponse<Response, any>>(
      api_user_password_forget_confirm,
      { newPassword: data.password },
      {
        params: {
          token: data.token,
        },
        transformResponse,
      },
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiAuthLogin = async (data: { email: string; password: string }) => {
  try {
    return await server.post<any, AxiosResponse<Response, any>>(
      api_oam_auth_login,
      data,
      postConfig,
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiAuthSession = async () => {
  try {
    return await server.get<any, AxiosResponse<Response, any>>(
      api_auth_session,
      postConfigOnlyToken(),
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiChangePassword = async (
  {
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  },
  token: string,
) => {
  try {
    return await server.post<any, AxiosResponse<Response, any>>(
      api_change_password,
      { oldPassword, newPassword }, // Use the variables here
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiResendRegister = async (data: { email: string }) => {
  try {
    return await server.post<any, AxiosResponse<Response, any>>(
      api_user_register_send_confirm,
      data,
      postConfig,
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiUserInfo = async () => {
  try {
    return await server.get<any, AxiosResponse<Response<IUserInfo>, any>>(
      api_oam_auth_login,
      postConfig,
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const apiPremiumAnnounce = async (token: string) => {
  try {
    return await server.get<any, AxiosResponse<PremiumResponse, any>>(api_user_announcement, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log('announceApi error', error);
    throw error;
  }
};

export const apiUserCloud = async (token: string) => {
  try {
    return await server.get<any, AxiosResponse<userCloudResponse, any>>(api_user_cloud, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log('userCloudApi error', error);
    throw error;
  }
};
