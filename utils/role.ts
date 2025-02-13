import intersectionBy from 'lodash/intersectionBy';
import { IUsers, OMSInfoResponse, OSSInfoResponse } from './types';

export enum Role {
  OAM_ROLE_OWNER = 'owner',
  OAM_ROLE_POWER_USER = 'power_user',
  OAM_ROLE_ADMIN = 'admin', // 暫時不用
  OAM_ROLE_USER = 'user',

  OMS_ROLE_ADMIN = 'admin', // mapping oam role owner
  OMS_ROLE_POWER_USER = 'power_user', // mapping oam role power_user
  OMS_ROLE_USER = 'user', // mapping oam role user
  OMS_ROLE_UNDEFINED = 'undefined', // mapping oam role user

  OSS_ROLE_PAID = 'paid',
  OSS_ROLE_FREE = 'free', // default
}

const {
  OAM_ROLE_OWNER,
  OAM_ROLE_POWER_USER,
  OAM_ROLE_ADMIN,
  OAM_ROLE_USER,
  OMS_ROLE_ADMIN,
  OMS_ROLE_POWER_USER,
  OMS_ROLE_USER,
  OMS_ROLE_UNDEFINED,
  OSS_ROLE_PAID,
  OSS_ROLE_FREE,
} = Role;

export type OAMRole =
  | typeof OAM_ROLE_OWNER
  | typeof OAM_ROLE_POWER_USER
  | typeof OAM_ROLE_ADMIN
  | typeof OAM_ROLE_USER;

export type OMSRole =
  | typeof OMS_ROLE_ADMIN
  | typeof OMS_ROLE_POWER_USER
  | typeof OMS_ROLE_USER
  | typeof OMS_ROLE_UNDEFINED;

export type OSSRole = typeof OSS_ROLE_PAID | typeof OSS_ROLE_FREE;

export type RoleItem = { label: string; value: Role; disabled?: boolean; tip?: string };
const makeRoleLabelMap = (roles: RoleItem[]) =>
  roles.reduce((someMap, role) => {
    someMap[role.value] = role;
    return someMap;
  }, {} as Record<Role, RoleItem>);

export const OamRole = [
  { label: 'User', value: OAM_ROLE_USER },
  { label: 'Power_user', value: OAM_ROLE_POWER_USER },
  { label: 'Admin', value: OAM_ROLE_ADMIN },
  { label: 'Owner', value: OAM_ROLE_OWNER },
];
export const oamRoleLabelMap = makeRoleLabelMap(OamRole);
export const OmsRole = [
  { label: '--', value: OMS_ROLE_UNDEFINED },
  { label: 'Admin', value: OMS_ROLE_ADMIN },
  { label: 'Power_user', value: OAM_ROLE_POWER_USER },
  { label: 'User', value: OAM_ROLE_USER },
];
export const omsRoleLabelMap = makeRoleLabelMap(OmsRole);
export const OssRole = [
  { label: 'OSS_advanced', value: OSS_ROLE_FREE }, // i18n.t('Free')
  { label: 'OSS_advanced', value: OSS_ROLE_PAID }, // i18n.t('Paid')
];

export const oamToOmsRole = (
  oamRole:
    | typeof OAM_ROLE_USER
    | typeof OAM_ROLE_POWER_USER
    | typeof OAM_ROLE_ADMIN
    | typeof OAM_ROLE_OWNER,
) =>
  ({
    [OAM_ROLE_USER]: OmsRole.filter(
      (role) => role.value === OMS_ROLE_UNDEFINED || role.value === OMS_ROLE_USER,
    ),
    [OAM_ROLE_POWER_USER]: OmsRole.filter(
      (role) => role.value !== OMS_ROLE_ADMIN && role.value !== OMS_ROLE_USER,
    ),
    [OAM_ROLE_ADMIN]: OmsRole.filter(
      (role) => role.value === OMS_ROLE_ADMIN || role.value === OMS_ROLE_UNDEFINED,
    ),
    [OAM_ROLE_OWNER]: OmsRole.filter((role) => role.value === OMS_ROLE_ADMIN),
  }[oamRole]);

export const limitedRouteRoles = [Role.OAM_ROLE_USER, Role.OAM_ROLE_OWNER, Role.OAM_ROLE_ADMIN];

export const allRoles = [
  Role.OAM_ROLE_POWER_USER,
  Role.OAM_ROLE_USER,
  Role.OAM_ROLE_OWNER,
  Role.OAM_ROLE_ADMIN,
];

export const OAMToOMSRoleMap = {
  [Role.OAM_ROLE_OWNER]: Role.OMS_ROLE_ADMIN,
  [Role.OAM_ROLE_ADMIN]: Role.OMS_ROLE_ADMIN,
  [Role.OAM_ROLE_POWER_USER]: Role.OMS_ROLE_POWER_USER,
  [Role.OAM_ROLE_USER]: Role.OMS_ROLE_USER,
};
export const OMSToOAMRoleMap = {
  [Role.OMS_ROLE_ADMIN]: Role.OAM_ROLE_ADMIN, // TODO spec?
  [Role.OMS_ROLE_POWER_USER]: Role.OAM_ROLE_POWER_USER,
  [Role.OMS_ROLE_USER]: Role.OAM_ROLE_USER,
  [Role.OMS_ROLE_UNDEFINED]: Role.OAM_ROLE_USER,
};

export const isOMSRoleDisable = (oamRole: OAMRole) =>
  ({
    [Role.OAM_ROLE_OWNER]: (omsRole: OMSRole) => false,
    [Role.OAM_ROLE_POWER_USER]: (omsRole: OMSRole) =>
      omsRole === Role.OMS_ROLE_ADMIN || omsRole === Role.OMS_ROLE_POWER_USER,
    [Role.OAM_ROLE_USER]: (omsRole: OMSRole) => Boolean(omsRole),
    [Role.OAM_ROLE_ADMIN]: (omsRole: OMSRole) => omsRole === Role.OMS_ROLE_ADMIN,
  }[oamRole]);

const makeAccessLevelMap = (levelOrder: Role[]) =>
  levelOrder.reduce((accessLevelMap, role, level) => {
    accessLevelMap[role] = level;
    return accessLevelMap;
  }, {} as Record<Role, number>);

const oamRoleAccessLevelOrder: OAMRole[] = [
  Role.OAM_ROLE_USER,
  Role.OAM_ROLE_POWER_USER,
  Role.OAM_ROLE_ADMIN,
  Role.OAM_ROLE_OWNER,
];
const omsRoleAccessLevelOrder: OMSRole[] = [
  Role.OMS_ROLE_UNDEFINED,
  Role.OMS_ROLE_USER,
  Role.OMS_ROLE_POWER_USER,
  Role.OAM_ROLE_ADMIN,
];
const oamAccessLevelMap = makeAccessLevelMap(oamRoleAccessLevelOrder) as Record<OAMRole, number>;
const omsAccessLevelMap = makeAccessLevelMap(omsRoleAccessLevelOrder) as Record<OMSRole, number>;

export class AccessControlModel {
  signedRole: OAMRole;
  signedEmail: string;
  operableRoles: OAMRole[];
  operableOmsRoles: OMSRole[];
  omsLicenseInfo: OMSInfoResponse['data'];
  ossLicenseInfo: OSSInfoResponse['data'];
  omsUserCount: number;
  ossUserCount: number;

  get omsUserLimit() {
    return this.omsLicenseInfo.userLimit;
  }

  constructor(
    { signedRole, signedEmail }: { signedRole: OAMRole; signedEmail: string },
    omsLicenseInfo: OMSInfoResponse['data'],
    ossLicenseInfo: OSSInfoResponse['data'],
    omsUserCount: number,
    ossUserCount: number,
  ) {
    this.signedRole = signedRole;
    this.signedEmail = signedEmail;
    this.omsLicenseInfo = omsLicenseInfo;
    this.ossLicenseInfo = ossLicenseInfo;
    this.omsUserCount = omsUserCount;
    this.ossUserCount = ossUserCount;

    this.operableRoles = oamRoleAccessLevelOrder.slice(0, oamAccessLevelMap[this.signedRole]);
    const autoOmsRole = AccessControlModel.getAutoOmsRole(this.signedRole);
    this.operableOmsRoles = omsRoleAccessLevelOrder.slice(0, omsAccessLevelMap[autoOmsRole]);
    if (this.signedRole === Role.OAM_ROLE_OWNER) {
      this.operableRoles = [...this.operableRoles, Role.OAM_ROLE_OWNER];
      this.operableOmsRoles = [...this.operableOmsRoles, autoOmsRole];
    }
  }

  getAssignableOamRoles(itemOamRole?: OAMRole) {
    if (itemOamRole && !this.operableRoles.includes(itemOamRole)) {
      return [{ ...oamRoleLabelMap[itemOamRole], disabled: true }];
    }
    return this.operableRoles.map((role) => oamRoleLabelMap[role]);
  }

  getMultiAssignableOamRoles(itemList: IUsers[]) {
    const nonEditables = new Set(itemList.length > 1 ? [Role.OAM_ROLE_OWNER] : []);
    return this.getAssignableOamRoles().map((role) => ({
      ...role,
      disabled: nonEditables.has(role.value),
    }));
  }

  getMultiAssignableOmsRoles(itemList: IUsers[]) {
    if (itemList.length < 1) {
      return [];
    }
    const assignables = itemList
      .map((item) => this.getAssignableOmsRolesNoPadding(item.oamRole))
      .reduce((roles1, roles2) => intersectionBy(roles1, roles2, 'value'));
    return this.padAssignableOmsRoles(assignables.map((role) => ({ ...role, disabled: false })));
  }

  getAddableAssignableOamRoles() {
    return this.getAssignableOamRoles().filter((item) => item.value !== Role.OAM_ROLE_OWNER);
  }

  getAssignableOmsRolesNoPadding(itemOamRole: OAMRole) {
    return oamToOmsRole(itemOamRole);
  }

  padAssignableOmsRoles(assignableRoles: RoleItem[], baseOmsRoles?: OMSRole[]) {
    return [...(baseOmsRoles ?? this.operableOmsRoles)].reverse().map((role) => {
      const found = assignableRoles.find((assignableRole) => assignableRole.value === role);
      if (found) {
        return found;
      }
      return {
        value: role,
        label: omsRoleLabelMap[role].label,
        disabled: true,
        tip: 'If_you_want_to_assign_role_to_OMS',
      };
    });
  }

  getAssignableOmsRoles(itemOamRole: OAMRole, itemOmsRole?: OMSRole, isSelf?: boolean) {
    if (itemOamRole === Role.OAM_ROLE_ADMIN && isSelf) {
      return this.padAssignableOmsRoles(oamToOmsRole(itemOamRole), omsRoleAccessLevelOrder);
    }
    if (itemOmsRole && !this.operableRoles.includes(itemOamRole)) {
      return [{ ...omsRoleLabelMap[itemOmsRole], disabled: true }];
    }
    return this.padAssignableOmsRoles(oamToOmsRole(itemOamRole));
  }

  getOmsUserDelta(oldRole: OMSRole, newRole: OMSRole) {
    if (oldRole === newRole) {
      return 0;
    }
    if (oldRole === Role.OMS_ROLE_UNDEFINED) {
      return 1;
    }
    if (newRole === Role.OMS_ROLE_UNDEFINED) {
      return -1;
    }
    return 0;
  }

  usersAddable(userDelta: number, userCount: number, userLimit: number) {
    if (userDelta === -1) {
      return true; //for Package downgrade(OMS)
    }
    return userDelta + userCount <= userLimit;
  }
  omsUsersAddable(omsUserDelta: number) {
    return this.usersAddable(omsUserDelta, this.omsUserCount, this.omsUserLimit);
  }

  isOmsRoleUpdateLimited(oldOmsRole: OMSRole, newOmsRole: OMSRole) {
    return !this.omsUsersAddable(this.getOmsUserDelta(oldOmsRole, newOmsRole));
  }

  isItemOamRoleDisabled(item: IUsers) {
    return (
      !item.emailConfirm ||
      !item.canEdit ||
      !this.isItemAuthorized(item) ||
      this.signedRole === Role.OAM_ROLE_POWER_USER
    );
  }

  isAddItemOamRoleDisabled() {
    return this.signedRole === Role.OAM_ROLE_POWER_USER;
  }

  isItemOmsRoleDisabledNoLimit(item: IUsers) {
    return (
      !item.emailConfirm ||
      !item.canEdit ||
      (!this.isItemAuthorized(item) &&
        (item.oamRole !== Role.OAM_ROLE_ADMIN || item.email !== this.signedEmail))
    );
  }

  isItemOmsRoleDisabled(item: IUsers) {
    return (
      this.isItemOmsRoleDisabledNoLimit(item) ||
      (this.isOmsUserLimitHit() && item.omsRole === Role.OMS_ROLE_UNDEFINED)
    );
  }

  isItemAuthorized(item: { oamRole: OAMRole }) {
    return oamAccessLevelMap[item.oamRole] < oamAccessLevelMap[this.signedRole];
  }

  isItemCheckable(item: IUsers) {
    return this.isItemAuthorized(item) && !!item.canEdit && !!item.emailConfirm;
  }

  isItemEditable(item: IUsers) {
    return (item.email === this.signedEmail || this.isItemAuthorized(item)) && !!item.canEdit;
  }

  isItemDeletable(item: IUsers) {
    return item.email !== this.signedEmail && this.isItemAuthorized(item) && !!item.canEdit;
  }

  static isItemDataTransferNeeded(oldOmsRole: OMSRole, newOmsRole: OMSRole) {
    return (
      omsAccessLevelMap[oldOmsRole] > omsAccessLevelMap[newOmsRole] &&
      AccessControlModel.itemContainsOmsData(oldOmsRole)
    );
  }

  static itemContainsOmsData(omsRole: OMSRole) {
    return omsAccessLevelMap[OMS_ROLE_USER] < omsAccessLevelMap[omsRole];
  }

  isOmsUserLimitHit() {
    return !this.omsUsersAddable(1);
  }

  isAddItemOmsRoleDisabled() {
    return this.isOmsUserLimitHit();
  }

  static getAutoOmsRole(newOamRole: OAMRole) {
    return OAMToOMSRoleMap[newOamRole] as OMSRole;
  }

  getCountPreservedAutoOmsRole(newOamRole: OAMRole, oldOmsRole: OMSRole = Role.OMS_ROLE_UNDEFINED) {
    if (oldOmsRole === Role.OMS_ROLE_UNDEFINED) {
      return Role.OMS_ROLE_UNDEFINED;
    }
    return AccessControlModel.getAutoOmsRole(newOamRole);
  }

  getPreviewAutoOmsRole(newOamRole: OAMRole, oldOmsRole: OMSRole = Role.OMS_ROLE_UNDEFINED) {
    if (newOamRole === Role.OAM_ROLE_OWNER) {
      return AccessControlModel.getAutoOmsRole(newOamRole);
    }
    return this.getCountPreservedAutoOmsRole(newOamRole, oldOmsRole);
  }

  getOldOwnerNewOmsRole(newOwnerOldOmsRole: OMSRole) {
    if (!this.omsUsersAddable(this.getOmsUserDelta(newOwnerOldOmsRole, Role.OMS_ROLE_ADMIN))) {
      return Role.OMS_ROLE_UNDEFINED;
    }
    return Role.OMS_ROLE_ADMIN;
  }
}
