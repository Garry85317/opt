import jwtDecode from 'jwt-decode';
import {
  api_am_confirm_age,
  api_initial_profile_am_apple_email,
  api_auth_sso_sign_in,
  api_oam_auth_login,
  api_oam_auth_logout,
  api_oam_auth_passport_qrcode,
  api_oam_auth_qrcode_login,
  api_oam_auth_redirect,
  api_oam_exchange_code,
  api_oam_exchange_token,
  api_user_change,
  api_user_sign_up,
} from '../../utils/apis';
import type { IAccountRegisterInfo, IAuth, ISignInModel } from '../../utils/types';
import { DecodeToken } from '../../utils/types';
import { clearAuthInfo, setAuthInfo } from '../actions';
import { GET, POST, api } from './base';

interface LoginResponse {
  data: IAuth;
}

export interface LoginRequest {
  email: string;
  password: string;
  type?: string;
  state?: string;
}

interface QRCodeLoginResponse {
  data: {
    accessToken: string;
  };
}

interface QRCodeLoginRequest {
  email: string;
  password: string;
  qrcode: string;
}

interface PassportQRCodeRequest {
  qrcode: string;
}

export interface SignUpResponse {
  data: {
    message: string;
    hasRedirect: boolean;
    redirectUrl: string;
  };
}

export interface SignUpRequest {
  data: IAccountRegisterInfo;
  recaptcha: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ExchangeTokenRequest {
  code: string;
}

export interface ExchangeCodeResponse {
  data: {
    code: string;
  };
}

export interface ConfirmEmailRequest {
  email: string;
  orgCountryCode: string;
  timezone: string;
}

export interface ConfirmEmailResponse {
  data: {
    message?: string;
  };
  version: string;
}

export interface ConfirmAgeRequest {
  isChild: boolean;
  guardianEmail: string;
  type: string;
  state: string;
}

export interface ConfirmAgeResponse {
  data: {
    redirectTo: string;
  };
  version: string;
}

export const authApi = api
  .enhanceEndpoints({
    // Used for caching and invalidating data
    addTagTypes: ['Auth'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation<LoginResponse, LoginRequest>({
        query: (body) => ({
          url: api_oam_auth_login,
          method: POST,
          body,
        }),
        // https://github.com/reduxjs/redux-toolkit/issues/1509
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            const {
              data: { data },
            } = await queryFulfilled;
            const { accountId, token, hasRedirect, redirectUrl } = data;
            dispatch(setAuthInfo({ accountId, token, hasRedirect, redirectUrl }));
          } catch (err) {
            dispatch(clearAuthInfo());
          }
        },
      }),
      qrcodeLogin: builder.mutation<QRCodeLoginResponse, QRCodeLoginRequest>({
        query: (body) => ({
          url: api_oam_auth_qrcode_login,
          method: POST,
          body,
        }),
        // https://github.com/reduxjs/redux-toolkit/issues/1509
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            const { accountId, oamRole } = jwtDecode(data.data.accessToken) as DecodeToken;
            dispatch(
              setAuthInfo({
                accountId,
                token: data.data.accessToken,
              }),
            );
          } catch (err) {
            console.log(err);
            dispatch(clearAuthInfo());
          }
        },
      }),
      passportQRCode: builder.mutation<void, PassportQRCodeRequest>({
        query: (body) => ({
          url: api_oam_auth_passport_qrcode,
          method: POST,
          body,
          responseHandler(response) {
            return new Promise((resolve, reject) => {
              if (response.status === 204) {
                resolve(response.status);
              } else {
                reject(response.status);
              }
            });
          },
        }),
      }),
      redirect: builder.query<{ data: { redirectTo: string } }, { type: string; state: string }>({
        query: (params) => ({
          url: api_oam_auth_redirect,
          method: GET,
          params,
        }),
      }),
      logout: builder.mutation<unknown, void>({
        query: () => ({
          url: api_oam_auth_logout,
          method: POST,
        }),
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(clearAuthInfo());
          } catch (err) {
            // redirect to login page if logout failed
            dispatch(clearAuthInfo());
          }
        },
      }),
      signUp: builder.mutation<SignUpResponse, SignUpRequest>({
        query: ({ data: body, recaptcha }) => ({
          url: api_user_sign_up,
          method: POST,
          headers: { recaptcha },
          body,
        }),
      }),
      SSOSignIn: builder.mutation<LoginResponse, ISignInModel>({
        query: (body) => ({
          url: api_auth_sso_sign_in,
          method: POST,
          body,
        }),
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            const {
              data: { data },
            } = await queryFulfilled;
            const { accountId, token } = data;
            dispatch(setAuthInfo({ accountId, token }));
          } catch (err) {
            dispatch(clearAuthInfo());
          }
        },
      }),
      changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
        query: (body) => ({
          url: api_user_change,
          method: POST,
          body,
          responseHandler(response) {
            return new Promise((resolve, reject) => {
              if (response.status === 200) {
                resolve(response.text());
              } else {
                resolve(response.json());
              }
            });
          },
        }),
      }),
      transCode: builder.mutation<LoginResponse, ExchangeTokenRequest>({
        query: (body) => ({
          url: api_oam_exchange_token,
          method: POST,
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
      transToken: builder.mutation<ExchangeCodeResponse, void>({
        query: () => ({
          url: api_oam_exchange_code,
          method: POST,
        }),
      }),
      initialProfileAMAppleEmail: builder.mutation<ConfirmEmailResponse, ConfirmEmailRequest>({
        query: (body) => ({
          url: api_initial_profile_am_apple_email,
          method: POST,
          body,
          responseHandler: (response: { text: () => any }) => response.text(),
        }),
      }),
      confirmAge: builder.mutation<ConfirmAgeResponse, ConfirmAgeRequest>({
        query: (body) => ({
          url: api_am_confirm_age,
          method: POST,
          body,
          // responseHandler: (response: { text: () => any }) => response.text(),
        }),
      }),
    }),
    overrideExisting: false,
  });

export const {
  useLoginMutation,
  useQrcodeLoginMutation,
  usePassportQRCodeMutation,
  useLazyRedirectQuery,
  useTransCodeMutation,
  useTransTokenMutation,
  useLogoutMutation,
  useSignUpMutation,
  useChangePasswordMutation,
  useSSOSignInMutation,
  useInitialProfileAMAppleEmailMutation,
  useConfirmAgeMutation,
} = authApi;
