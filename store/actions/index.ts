import { createAction } from '@reduxjs/toolkit';
import {
  IAccount,
  AuthState,
  IOrganization,
  userEmailTokenResponse,
  DeleteDeviceRequest,
  ExchangeTokenResponse,
} from '../../utils/types';

// Auth
export const setAuthInfo = createAction<AuthState>('auth/setAuthInfo');
export const clearAuthInfo = createAction<void>('auth/clearAuthInfo');

// Account
export const setUserInfo = createAction<IAccount>('account/setUserInfo');
export const setUserTokenEmail = createAction<userEmailTokenResponse>('account/emailToken');
export const setDeleteUser = createAction<void>('account/delete');
export const setGuardianConfirm = createAction<boolean>('user/guardianConfirm');

// Organization
export const setOrganization = createAction<IOrganization>('organization/setOrganization');

// Device
export const refreshToken = createAction<ExchangeTokenResponse>('device/refreshToken');
export const deleteDevices = createAction<DeleteDeviceRequest['deviceIds']>('device/deleteDevices');
