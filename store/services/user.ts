import jwtDecode from 'jwt-decode';
import range from 'lodash/range';
import {
  paramsToUrl,
  api_organization_info,
  api_organization_user,
  api_organization_user_import,
  api_organization_user_info,
  api_organization_user_role,
  api_organizations_user_send_invitation,
  api_organizations_users_password,
  api_user,
  api_user_exists,
  api_user_first_login,
  api_user_forgot_password,
  api_user_guardian_confirm,
  api_user_password_forget_confirm,
  api_user_register_apple_confirm,
  api_user_register_confirm,
  api_user_register_send_confirm,
  api_user_send_guardian_confirm,
  api_user_token_email,
  api_user_age_deacitve,
  api_initial_profile_am_age_active,
  api_organization_updateLatestInfo,
} from '../../utils/apis';
import type {
  DecodeToken,
  EmailExistsResponse,
  IAccount,
  IAuth,
  ICreateOrganizationUser,
  IOrganization,
  IOrganizationUserId,
  IOrganizationUserRole,
  IUpdateOrganizationUser,
  MessageResponse,
  SearchUsers,
  firstLogin,
  firstLoginResponse,
  guardianConfirmStatusResponse,
  guardianSendEmailResponse,
} from '../../utils/types';
import { IUsers } from '../../utils/types';
import {
  clearAuthInfo,
  setAuthInfo,
  setDeleteUser,
  setOrganization,
  setUserInfo,
} from '../actions';
import { DELETE, GET, PATCH, POST, api } from './base';

type AcitvateResquest = {
  orgCountryCode: string;
  timezone: string;
};
type AcitvateResponse = {
  data: IAuth;
};

type EmailPayload = {
  email: string;
};

type TokenPayload = {
  token: string;
};

export type PasswordPayload = {
  password: string;
  token: string;
};

export interface EmailTokenResponse {
  data: {
    email: string;
    isExpired: boolean;
  };
}
export interface ResendResponse extends MessageResponse {}

export interface ConfirmResponse {
  data: {
    solution: string; // 'AM';
    type: string;
    state: string;
    hasBackToLogin: boolean;
  };
  version: string;
}

export type UserResponse = {
  data: IAccount & { organization: IOrganization };
};

export type UserPayload = {
  name: string;
  avatar: string;
  language: string;
  timezone: string;
  formatDate: string;
  isAutoLogout?: boolean;
  deviceGoogleAccount?: string;
};

export type OrganizationPayload = {
  updateTarget: number;

  organization?: string;
  type?: string;
  othersName?: string;

  country?: string;
  city?: string;
  state?: string;
  address?: string;
};

export type SearchUsersResponse = {
  data: {
    count: number;
    data: IUsers[];
    omsUsersCount?: number;
    ossUsersCount?: number;
  };
};

export type OrganizationUserInfoResponse = {
  data: IUsers;
};

export type OrganizationUserResponse = {
  data: {
    failed: {
      isDuplicated: boolean;
      requiredMissing: boolean;
      hasUnknownError: boolean;
      nfcFormatError: boolean;
    };
  };
};

type OrganizationLatestInfo = {
  hasAgreedToTerms: boolean;
};

export type OrganizationResponse = {
  data: {
    name: string;
    organizationType: string;
    country: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    guid: string;
    latestInfoDto: OrganizationLatestInfo;
  };
  version: string;
};

export type DeleteUserPayload = {
  emails?: string[];
  transferredEmails?: string[];
  transferToId?: string;
};

const USER_BATCH_SIZE = 40;

const ownerFirstSort = (a: IUsers, b: IUsers) => {
  if (a.oamRole === 'owner') {
    return -1;
  }
  if (b.oamRole === 'owner') {
    return 1;
  }
  return a.email.localeCompare(b.email);
};

const transformPayload = (payload: Record<string, any>, keyMap: Record<string, string>) =>
  Object.keys(payload).reduce((acc, key) => {
    acc[keyMap[key] ?? key] = payload[key];
    return acc;
  }, {} as Record<string, any>);

const rolePayloadKeyMap = { transferToId: 'targetOAMAccountId' };

export type UpdateOrgLatestInfoPayload = {
  //true if agree (only works when true)
  hasAgreedToTerms?: boolean;
};

export const userApi = api
  .enhanceEndpoints({
    // Used for caching and invalidating data
    addTagTypes: ['Account', 'Organization', 'User'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      checkEmailToken: builder.query<EmailTokenResponse, TokenPayload>({
        query: (token) => ({
          url: api_user_token_email,
          params: token,
        }),
      }),

      resendRegister: builder.mutation<ResendResponse, EmailPayload>({
        query: (body) => ({
          url: api_user_register_send_confirm,
          method: POST,
          body,
        }),
      }),

      confirmRegister: builder.mutation<ConfirmResponse, TokenPayload>({
        query: (params) => ({
          url: api_user_register_confirm,
          method: POST,
          params,
        }),
      }),

      confirmAppleRegister: builder.mutation<ConfirmResponse, TokenPayload>({
        query: (params) => ({
          url: api_user_register_apple_confirm,
          method: POST,
          params,
        }),
      }),

      accountDelete: builder.mutation<void, { transferToId: string } | void>({
        query: (params) => ({
          url: api_user,
          method: 'DELETE',
          params: params ? { targetOAMAccountId: params.transferToId } : undefined,
        }),
        async onQueryStarted(_body, { dispatch }) {
          try {
            dispatch(setDeleteUser());
          } catch (err) {
            console.log(err);
          }
        },
      }),
      forgetPassword: builder.mutation<void, EmailPayload>({
        query: (body) => ({
          url: api_user_forgot_password,
          method: POST,
          body,
          responseHandler: (response: { text: () => any }) => response.text(),
        }),
      }),

      resetPassword: builder.mutation<void, PasswordPayload>({
        query: ({ password, token }) => ({
          url: api_user_password_forget_confirm,
          method: POST,
          params: { token },
          body: { newPassword: password },
          responseHandler: (response: { text: () => any }) => response.text(),
        }),
      }),

      getUser: builder.query<UserResponse, void>({
        query: () => ({
          url: api_user,
        }),
        providesTags: (result, error, arg) =>
          result ? [{ type: 'Account' }, { type: 'Organization' }] : [],
        async onQueryStarted(_body, { dispatch, queryFulfilled }) {
          try {
            const {
              data: {
                data: { organization, ...account },
              },
            } = await queryFulfilled;
            dispatch(setUserInfo(account));
            dispatch(setOrganization(organization));
          } catch (err) {
            console.log(err);
          }
        },
      }),

      session: builder.query<UserResponse, void>({
        query: () => ({
          url: api_user,
        }),
      }),

      updateUser: builder.mutation<void, UserPayload>({
        query: (body) => ({
          url: api_user,
          method: PATCH,
          body,
          responseHandler: (response: { text: () => any }) => response.text(),
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Account' }],
      }),

      updateOrganization: builder.mutation<OrganizationResponse, OrganizationPayload>({
        query: ({ organization: name, type: organizationType, ...body }) => ({
          url: api_organization_info,
          method: PATCH,
          body: { ...body, name, organizationType },
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Organization' }],
      }),

      getOrganizationUsers: builder.query<SearchUsersResponse, SearchUsers>({
        query: (params) => ({
          url: `${api_organization_user}/${paramsToUrl(params)}`,
          // params,
        }),
        providesTags: (result, error, arg) =>
          result && result.data.count
            ? result.data.data.map((user) => ({
                type: 'User',
                id: user.accountId,
                email: user.email,
              }))
            : [],
      }),

      getTransferrableOrganizationUsers: builder.query<SearchUsersResponse, SearchUsers>({
        async queryFn(options, api, extraOptions, baseQuery) {
          const optionsOverride = { ...options, offset: 0, limit: USER_BATCH_SIZE };
          const { data, error } = await baseQuery({
            url: `${api_organization_user}/${paramsToUrl(optionsOverride)}`,
          });
          if (error) {
            return { error };
          }
          const responseData = data as SearchUsersResponse;
          if (responseData.data.count <= USER_BATCH_SIZE) {
            const sortedUsers = [...responseData.data.data].sort(ownerFirstSort);
            return { data: { data: { data: sortedUsers, count: responseData.data.count } } };
          }
          const offsets = range(1, Math.ceil(responseData.data.count / USER_BATCH_SIZE));
          const requests = offsets.map((offset) =>
            baseQuery({
              url: `${api_organization_user}/${paramsToUrl({
                ...optionsOverride,
                offset: offset * USER_BATCH_SIZE,
              })}`,
            }),
          );
          const responses = await Promise.all(requests);
          const responseWithError = responses.find((r) => !!r.error);
          if (responseWithError) {
            return { error: responseWithError.error! };
          }
          const allUsers = responses.reduce(
            (acc, response) => acc.concat((response.data as SearchUsersResponse).data.data),
            responseData.data.data,
          );
          const sortedAllUsers = [...allUsers].sort(ownerFirstSort);
          return { data: { data: { data: sortedAllUsers, count: sortedAllUsers.length } } };
        },
        providesTags: (result, error, arg) => [{ type: 'User' }],
      }),

      getOrganizationUserCount: builder.query<SearchUsersResponse, void>({
        query: () => ({
          url: `${api_organization_user}`,
        }),
      }),

      getOrganizationUser: builder.query<OrganizationUserInfoResponse, IOrganizationUserId>({
        query: (params) => ({
          url: api_organization_user_info,
          params,
        }),
      }),

      createOrganizationUser: builder.mutation<OrganizationUserResponse, ICreateOrganizationUser>({
        query: (body) => ({
          url: api_organization_user,
          method: POST,
          body,
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'User', email: arg.email }],
      }),

      updateOrganizationUserRole: builder.mutation<void, IOrganizationUserRole>({
        query: (body) => ({
          url: api_organization_user_role,
          method: POST,
          body,
          responseHandler: (response: { text: () => any }) => response.text(),
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'User', email: arg.email }], // TODO test email invalidate tag work
      }),

      updateMultiOrganizationUserRoles: builder.mutation<void | boolean, IOrganizationUserRole[]>({
        async queryFn(roles, api, extraOptions, baseQuery) {
          const updates = roles.map((role) =>
            baseQuery({
              url: api_organization_user_role,
              method: POST,
              body: transformPayload(role, rolePayloadKeyMap),
            }),
          );
          const updateResults = await Promise.all(updates);
          const errorResult = updateResults.find((r) => !!r.error);
          if (errorResult) {
            return { error: errorResult.error };
          }
          return { data: true };
        },
        invalidatesTags: (result, error, arg) => [{ type: 'User' }],
      }),

      updateOrganizationUser: builder.mutation<void, IUpdateOrganizationUser>({
        query: (body) => ({
          url: api_organization_user_info,
          method: PATCH,
          body,
          responseHandler: (response: { text: () => any }) => response.text(),
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'User', email: arg.email }],
      }),

      sendOrganizationUserInvitation: builder.mutation<void, { email: string }>({
        query: (body) => ({
          url: api_organizations_user_send_invitation,
          method: POST,
          body,
          responseHandler: (response: { text: () => any }) => response.text(),
        }),
      }),

      organizationsUsersPassword: builder.mutation<void, { token: string; newPassword: string }>({
        query: ({ token, ...body }) => ({
          url: api_organizations_users_password,
          params: {
            token,
          },
          method: POST,
          body,
        }),
      }),

      deleteOrganizationUser: builder.mutation<void | boolean, DeleteUserPayload>({
        async queryFn(users, api, extraOptions, baseQuery) {
          const { emails, transferredEmails, transferToId } = users;
          const deleteRequest =
            emails &&
            baseQuery({
              url: api_organization_user,
              method: DELETE,
              body: { emails },
            });
          const transferRequest =
            transferredEmails &&
            transferToId &&
            baseQuery({
              url: api_organization_user,
              method: DELETE,
              body: { emails: transferredEmails, targetOAMAccountId: transferToId },
            });
          const requests = [];
          deleteRequest && requests.push(deleteRequest);
          transferRequest && requests.push(transferRequest);
          const responses = await Promise.all(requests);
          const errorResponse = responses.find((r) => !!r.error);
          if (errorResponse) {
            return { error: errorResponse.error! };
          }
          return { data: true };
        },
        invalidatesTags: (result, error, arg) => [{ type: 'User' }],
      }),

      importOrganizationUser: builder.mutation<OrganizationUserResponse, FormData>({
        query: (body) => ({
          url: api_organization_user_import,
          method: POST,
          body,
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'User' }],
      }),

      guardianConfirmStatus: builder.mutation<guardianConfirmStatusResponse, void>({
        query: () => ({
          url: api_user_guardian_confirm,
          method: GET,
        }),
      }),

      sendGuardianConfirm: builder.mutation<guardianSendEmailResponse, void>({
        query: () => ({
          url: api_user_send_guardian_confirm,
          method: POST,
        }),
      }),

      userFirstLogin: builder.query<firstLoginResponse, firstLogin>({
        query: ({ data: body, recaptcha }) => ({
          url: api_user_first_login,
          method: POST,
          headers: { recaptcha },
          body,
        }),
        // https://github.com/reduxjs/redux-toolkit/issues/1509
        async onQueryStarted(body, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            if (data.data.token) {
              const { accountId, oamRole } = jwtDecode(data.data.token) as DecodeToken;
              dispatch(
                setAuthInfo({
                  accountId,
                  token: data.data.token,
                }),
              );
            }
          } catch (err) {
            dispatch(clearAuthInfo());
          }
        },
      }),
      userExists: builder.query<EmailExistsResponse, { email: string }>({
        query: (params) => ({
          url: api_user_exists,
          params,
        }),
      }),
      ageDeactive: builder.mutation<void, void>({
        query: () => ({
          url: api_user_age_deacitve,
          method: 'POST',
        }),
        async onQueryStarted(_body, { dispatch }) {
          try {
            dispatch(setDeleteUser());
          } catch (err) {
            console.log(err);
          }
        },
      }),
      initialProfileAMAgeActive: builder.mutation<AcitvateResponse, AcitvateResquest>({
        query: (body) => ({
          url: api_initial_profile_am_age_active,
          method: 'POST',
          body,
        }),
      }),

      updateOrganizationLatestInfo: builder.mutation<void, UpdateOrgLatestInfoPayload>({
        query: (body) => ({
          url: api_organization_updateLatestInfo,
          method: PATCH,
          body,
          responseHandler: (response: { text: () => any }) => response.text(),
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Organization' }],
      }),
    }),
    overrideExisting: false,
  });

export const {
  //user
  useCheckEmailTokenQuery,
  useResendRegisterMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useConfirmRegisterMutation,
  useConfirmAppleRegisterMutation,
  useAccountDeleteMutation,
  useGuardianConfirmStatusMutation,
  useSendGuardianConfirmMutation,
  //organization
  useUpdateOrganizationMutation,
  useGetOrganizationUsersQuery,
  useLazyGetOrganizationUserQuery,
  useLazyGetOrganizationUserCountQuery,
  useLazyGetOrganizationUsersQuery,
  useCreateOrganizationUserMutation,
  useUpdateOrganizationUserRoleMutation,
  useUpdateOrganizationUserMutation,
  useSendOrganizationUserInvitationMutation,
  useOrganizationsUsersPasswordMutation,
  useDeleteOrganizationUserMutation,
  useImportOrganizationUserMutation,
  useLazyUserFirstLoginQuery,
  useLazyUserExistsQuery,
  useAgeDeactiveMutation,
  useInitialProfileAMAgeActiveMutation,
  useLazySessionQuery,
  useUpdateMultiOrganizationUserRolesMutation,
  useLazyGetTransferrableOrganizationUsersQuery,
  useUpdateOrganizationLatestInfoMutation,
} = userApi;
