import i18n from '../i18n';
import type { OAMRole, OMSRole, OSSRole } from './role';

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = '',
}

export enum OrganizationType {
  Distributor = 'Distributor',
  Reseller_System_Integrator = 'Reseller_System_Integrator',
  School = 'School',
  University = 'University',
  Enterprise = 'Enterprise',
  Individual = 'Individual',
  Others = 'Others',
}

export const period = [
  { label: i18n.t('Yearly'), value: 'yearly', amount: 49.9 },
  { label: i18n.t('Monthly'), value: 'monthly', amount: 59.9 },
];
export const userBannerType = {
  upgrade: 1,
  expired: 2,
};

export const userSettingType = {
  edit: 1,
  delete: 2,
  resend_verification: 3,
};

export const deviceSettingType = {
  rename: 1,
  delete: 2,
};

export interface IUsers {
  id: string;
  accountId: string;
  name: string;
  email: string;
  // password: string;
  language?: string;
  // age: string;
  avatar?: string;
  // timezone: string;
  oamRole: OAMRole;
  omsRole: OMSRole;
  ossRole: OSSRole;
  nfc01?: string;
  nfc02?: string;
  note?: string;
  // organizationName: string;
  // isGuardianUser: boolean;
  // guardianEmail: string;
  emailConfirm?: boolean;
  // confirmCode: string;
  provider: string;
  // loginAt: string;
  // refreshAt: string;
  createdDatetime: string;
  updatedDatetime: string;
  guardianExpireDatetime?: string;
  canEdit?: boolean;
}

export interface IUsersAdd {
  name: string;
  email: string;
  language: string;
  nfc01: string;
  nfc02: string;
  note: string;
  oamRole: string;
  omsRole: string;
  ossRole: string;
}

export interface IUserInfo {
  id: number;
  organizationName: string;
  organizationType: string;
  invoiceEmail: string;
  location: string;
  state: string;
  city: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export type OmsAccountInfo = {
  timezoneCode?: string;
  dateFormat?: string;
  location?: string;
  state?: string;
  city?: string;
  address?: string;
  isMarketingPromo: boolean;
};

export interface DeviceInfo {
  id: string;
  sn: string;
  name: string;
  type: string;
  description: string;
  creatorId: string;
  model?: string;
  secondaryModel?: string;
  createTime?: string;
  createdTime?: string;
  modifiedTime?: string;
  creatorOAMId?: string;
  modifierOAMId?: string;
  addFrom: string;
  gatewayId: string;
  gatewayLocalIp: string;
  ip: string;
}

export interface Alert {
  nuId: number;
  accountId: string;
  deviceSN: string;
  deviceAlertDateTime: string;
  deviceAlertIsRead: boolean;
  deviceAlertIsDeleted: boolean;
  deviceAlertLog: string;
  deviceAlertType: string;
  deviceAlertValue: string;
}

export interface Location {
  locationId: string;
  locationName: string;
  stateCode: string;
  stateName: string;
  cityId: string;
  cityName: string;
  buildingId: string;
  buildingName: string;
  floorId: string;
  floorName: string;
  roomId: string;
  roomName: string;
}

export interface Group {
  id: string;
  name: string;
  desc: string;
  creator: string;
  createTime: string;
}

export interface LatestInfo {
  deviceStatus: string; // '0: Disconnected';
  ipAddress: string;
  macAddress: string;
  fwVersion: string;
  deviceRuntimeStatus: string; // '0: None';
  deviceRuntimeValue: number;
  deviceConnected: boolean;
  temperatureStatus: string; // '0: None';
  fanStatus: string; // '0: None';
  muteStatus: string; // '0: Off';
  avMute: string;
  videoMute: string;
  audioMute: string;
  powerOnOff: boolean;
  restart: boolean;
  inputSource: string;
  lastPowerOnTime: string;
  fotaConnect: boolean;
  osdSettingLockStatus: boolean;
  displayMode: string;
  aspectRatio: string;
  brightness: string;
  soundEffect: string;
  autoPowerOff: boolean;
  autoPowerOffTime: string;
  volume: string;
  brightnessMode: string;
  brightnessLevel: string;
}

export interface IDevice extends DeviceInfo {
  regulatoryName?: string;
  creator?: string;
  alerts?: Alert[];
  location?: Location;
  groups?: Group[];
  latestInfo?: LatestInfo;
}

export interface ILicenseInfo {
  organizationName: string;
  plan: string;
  planDesc: string;
  autoRenew: boolean;
  type: string; // oms, oss
  expiryDate: string;
  startDate: string;
  userLimit: number;
  deviceLimit: number;
  storageLimit: string;
}

export interface IInvoiceInfo {
  id: number;
  organizationName: string;
  licenseId: string;
  invoiceDate: string;
  paymentDate: string;
  description: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContactUser {
  firstName: string;
  lastName: string;
  workEmail: string;
  phoneNumber: string;
  message: string;
}

export interface IPlan {
  id: number;
  plan: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITokenPayload {
  token: string;
  accountId: string;
  tokenType: string;
  hasRedirect: boolean;
  redirectUrl: string | null;
}

export type DecodeToken = {
  accountId: string;
  email: string;
  exp: string;
  iat: number;
  jti: number;
  name: string;
  owner: string;
  oamRole: OAMRole;
  service: string;
  uuid: string;
  isInitialProfile: boolean;
  meta?: {
    [x: string]: any;
  };
};

export interface IAccountRegisterInfo {
  name: string;
  email: string;
  password: string;
  language: string;
  // age: string;
  timezone: string;
  organization: IOrganization;
  guardianEmail: string; //age <13
  type: string;
  state: string;
  avatar: string;
}

export interface ISignInModel {
  source: 'google' | 'apple' | 'microsoft';
  code: string;
  state: string;
}

export interface IAuth {
  accountId: string;
  token: string;
  refreshToken?: string;
  tokenType?: 'Bearer';
  hasRedirect?: boolean;
  redirectUrl?: string | null;
  changePasswordLink?: string;
}

export type AuthState = IAuth & { oamRole?: OAMRole };

export interface IAccount {
  id?: string;
  accountId: string;
  name: string;
  email: string;
  timezone: string; //'Asia/Taipei';
  language: string; //'zh-hant';
  formatDate: string; //'DD/MM/YYYY';
  platform?: string;
  provider: string; //'oam';
  avatar: string;
  age?: string;
  isAutoLogout?: boolean;
  deviceGoogleAccount?: string;
  // createdDatetime: '2023-09-06T05:47:33.616Z';
  // updatedDatetime: '2023-09-06T05:47:33.616Z';
  // guardianExpireDatetime: '2023-09-06T05:47:33.616Z';
}

export interface IOrganizationUserInfo {
  name?: string;
  id: string;
  email?: string;
  language?: string; // 'zh-hant';
  nfc01?: string;
  nfc02?: string;
  note?: string;
}

export interface IRole {
  oamRole?: string; // 'user';
  omsRole?: string; // 'power_user';
  ossRole?: string; // 'paid';
}

export interface IOrganizationUserRole extends IRole, IOrganizationUserId {
  email: string;
  transferToId?: string;
}

export interface IOrganizationUserId {
  id?: string;
  accountId?: string;
}

export interface ICreateOrganizationUser extends Omit<IOrganizationUserInfo, 'id'>, IRole {}
export interface IUpdateOrganizationUser extends IOrganizationUserInfo, IRole {}

export interface IOrganization {
  id?: string;
  name: string;
  type: string; // 'Distributor' // organizationType
  country: string;
  city: string;
  state: string; // zip
  address: string;
  phone?: string;
  othersName?: string; // if organizationType == 'others'
  createdAt?: Date | null;
  latestInfoDto?: ILatestInfoDto;
}

export interface ILatestInfoDto {
  hasAgreedToTerms?: boolean; // Is owner agree new agreement
}

export type MessageResponse = {
  data: { message: string };
};

export type SearchUsers = {
  offset?: number;
  limit?: number;
  sort?: string; // TODO
  sortBy?: string;
  searchWord?: string;
  oamRole?: string[]; // TODO
  omsRole?: string[]; // TODO
  ossRole?: string[]; // TODO
};

export enum PairType {
  OneDrive = 'one_drive',
  GoogleDrive = 'google_drive',
  GoogleClassroom = 'google_classroom',
}

export interface userCloudResponse {
  data: {
    type: PairType;
    email: string;
  }[];
  version: string;
}

export interface cloudPairResponse {
  data: {
    redirectURL: string;
  };
  version: string;
}

export interface ExchangeTokenResponse {
  data: {
    data: {
      token: string;
      isCompletedAccountInfo: boolean;
      omsRoleId?: number;
      oamRoleId?: number;
      omsId?: string;
      licenseInfo?: {
        displayName: string;
        description: string;
        expiresAt: string;
      };
    };
    isSuccess: boolean;
    errorCode: number;
    errorInfo: string;
  };
  version: string;
}

export interface GetExpiryResponse {
  data: {
    expirySec: number;
  };
  version: string;
}

export interface DeviceResponse {
  data: {
    totalCount: number;
    maxPageIndex: number;
    data?: IDevice[];
    isSuccess: boolean;
    errorCode: number;
    errorInfo: string;
  };
  version: string;
}

export interface CheckSNResponse {
  data: {
    isSuccess?: boolean;
    errorCode?: number;
    errorInfo?: string;
    message?: string;
  };
  version: string;
}

interface CheckDevice {
  deviceSN: string;
  _StatusCode: number;
  _Status: string | null;
  pinCode: string;
  pinCode_ExpireTime: string;
  _PinCode_CreateTime: string;
  _PinCodeStatus: string;
}

export interface StepOneResponse {
  data: {
    data: CheckDevice[];
    isSuccess: boolean;
    errorCode: number;
    errorInfo: string;
  };
  version: string;
}

export interface PairResponse {
  data: {
    deviceSN: string;
    resultCode: 0 | 1 | 2 | 3;
  }[];
  version: string;
}

export interface PincodeResponse {
  data: CheckDevice;
  version: string;
}

export interface StepTwoResponse {
  data: {
    deviceSN: string;
    deviceId: string;
    deviceType: string;
    modifiedDate: string;
  };
  version: string;
}

export interface PremiumResponse {
  data: {
    am: true;
    cb: true;
    cc: true;
    oam: false;
    oms: true;
    description?: {
      oms: string[];
      oss: string[];
    };
    endDate?: {
      oms: string;
      oss: string;
    };
  };
  version: string;
}

export interface userEmailTokenResponse {
  data: {
    email: string;
  };
  version: string;
}

export type guardianConfirmStatusResponse = {
  data: {
    child_email: string;
    guardian_email: string;
    approved: boolean;
  };
  version: string;
};

export type guardianSendEmailResponse = {
  data: {
    message: string;
  };
  version: string;
};

export interface firstLogin {
  data: {
    email?: string;
    name: string;
    language: string;
    // guardianEmail: string;
    organization: {
      name: string;
      type: string;
      country?: string;
      othersName?: string;
    };
    type?: string;
    state?: string;
    timezone: string;
  };
  recaptcha: string;
}

export interface firstLoginResponse {
  data: {
    token: string;
    accountId: string;
    tokenType: string;
    hasRedirect: boolean;
    redirectUrl: string;
    changePasswordLink?: string; // TODO remove
  };
  version: 'string';
}

export interface deleteUserResponse {
  accessControlAllowOrigin: string;
  date: string;
  etag: string;
  server: string;
  via: string;
  xAmzCfId: string;
  xAmzCfPop: string;
  xCache: string;
  xTracingId: string;
}

export type DeleteDeviceRequest = {
  deviceIds: string[];
  csrfToken?: string;
};

export type DeleteGatewayDeviceRequest = {
  csrfToken?: string;
  gatewayId: string;
  gatewayLocalIp: string;
  ip: string[];
};

export type OMSInfoResponse = {
  data: {
    plan: string;
    planDesc: string;
    role: string;
    organizationName: string;
    autoRenew: boolean;
    users: {
      admin: number;
      power: number;
      user: number;
    };
    storage: {
      app: number;
      autoFocus: number;
      broadcast: number;
      osd: number;
      playlist: number;
      usage: number;
      limit: string;
    };
    userLimit: number;
    deviceLimit: number;
    expiryDate: string;
    expiryUTCDate: string;
    startDate: string;
    startUTCDate: string;
    isActive: boolean;
  };
};

export type OSSInfoResponse = {
  data: {
    plan: string;
    planDesc: string;
    role: string;
    createSessionLimit: number;
    attendeeCount: number;
    attendeeLimit: number;
    credit: number | string;
    storageLimit: string;
    expiryDate: string;
    expiryUTCDate: string;
    startDate: string;
    startUTCDate: string;
  };
};

export type EmailExistsResponse = {
  data: {
    exists: boolean;
  };
};

export enum PackageStatus {
  Expired = -1,
  Normal,
  ExceededLimit,
}
export interface PackageStatusCheckResult {
  count: number;
  limit: number;
  status: PackageStatus;
}
