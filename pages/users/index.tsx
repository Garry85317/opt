import {
  Container,
  Card,
  FileInput,
  Flex,
  Grid,
  Group,
  MediaQuery,
  Menu,
  Notification,
  Text,
  Tooltip,
  createStyles,
  em,
  getBreakpointValue,
  rem,
  useMantineTheme,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce, useMap } from 'usehooks-ts';
import groupBy from 'lodash/groupBy';
import ActionBar from '../../components/actionBar';
import ActionsMenu from '../../components/base/ActionsMenu';
import Anchor from '../../components/base/Anchor';
import Breadcrumbs from '../../components/base/Breadcrumbs';
import Checkbox from '../../components/base/Checkbox';
import Select, { OAMSelectType } from '../../components/base/Select';
import UsersTable, { UserData } from '../../components/users/UsersTable';
import {
  InfoIcon,
  PlusDarkIcon,
  UserDeleteIcon,
  UserImportIcon,
  UserAssignIcon,
} from '../../components/base/icon';
import { usePopup } from '../../providers/popupProvider';
import { useSelector } from '../../store';
import {
  useDeleteOrganizationUserMutation,
  useImportOrganizationUserMutation,
  useLazyGetOrganizationUsersQuery,
  useLazyOssInfoQuery,
  useSendOrganizationUserInvitationMutation,
  useUpdateMultiOrganizationUserRolesMutation,
  useUpsertNotificationFlagMutation,
} from '../../store/services';
import type { DeleteUserPayload } from '../../store/services';
import {
  selectAccount,
  selectUsers,
  selectLicense,
  selectLicenseNotification,
} from '../../store/slices';
import {
  OAMRole,
  OMSRole,
  OamRole,
  OmsRole,
  OssRole,
  Role,
  AccessControlModel,
} from '../../utils/role';
import {
  IOrganizationUserRole,
  IUsers,
  SearchUsers,
  Sort,
  userSettingType,
  PackageStatus,
  PackageStatusCheckResult,
} from '../../utils/types';
import { useJWTContext } from '../../providers/jwtProvider';
import Dialog, { OAMDialogType } from '../../components/dialog';
import { oamNotifications, oamNotificationsShowUntil } from '../../components/base/Notifications';
import useUserDataTransfer from '../../hooks/useUserDataTransfer';
import useRoleOptionsTranslation from '../../hooks/useRoleOptionsTranslation';
import tooltipStyles from '../../style/tooltip';
import { CustomLoader } from '../../components/customLoader';

interface RowData {
  checked: boolean;
  name: string;
  oam_role: string;
  oms_role: string;
  oss_role: string;
  nfc_01: string;
  nfc_02: string;
}

type FilterRole = {
  oamRole: string[];
  omsRole: string[];
  ossRole: string[];
};

const useStyles = createStyles((theme) => ({
  filterItem: {
    ':is([data-hovered])': {
      backgroundColor: 'var(--gray-f-2-f-2-f-2, #F2F2F2)',
    },
  },
  icon: {
    ':hover': {
      'path:first-of-type': {
        fill: '#01256B',
      },
    },
  },
}));

function Users() {
  const { t } = useTranslation();
  const roleOptionsTranslator = useRoleOptionsTranslation(t);
  const theme = useMantineTheme();
  const router = useRouter();
  const [getOrganizationUsers, getOrganizationUsersStatus] = useLazyGetOrganizationUsersQuery();
  const { message, loadingPopup } = usePopup();
  const [file, setFile] = useState<File | null>(null);
  const [importFilePopupOpened, importFilePopupActions] = useDisclosure(false);
  const filterMenu = [
    { label: t('Oms_admin'), value: Role.OMS_ROLE_ADMIN, checked: false },
    { label: t('Oms_power_user'), value: Role.OMS_ROLE_POWER_USER, checked: false },
    { label: t('Oms_user'), value: Role.OMS_ROLE_USER, checked: false },
  ];
  const { classes } = useStyles();
  const account = useSelector(selectAccount);
  const { users, count, omsUsersCount } = useSelector(selectUsers);
  const { oms, oss } = useSelector(selectLicense);
  const [usersMap, usersDataAction] = useMap<string, IUsers>(new Map());
  const [checkedUsersMap, checkedUsersDataAction] = useMap<string, boolean>(new Map());
  const ref = useRef<HTMLButtonElement>(null);
  const [getOSSLicenseInfo, ossStatus] = useLazyOssInfoQuery();

  useEffect(() => {
    if (ossStatus.isUninitialized) getOSSLicenseInfo();
  }, [ossStatus]);

  useEffect(() => {
    usersDataAction.setAll(
      (users as IUsers[]).reduce((map, user) => map.set(user.id, user), new Map<string, IUsers>()),
    );
  }, [users]);

  const limit = 10;
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof RowData | undefined>();
  const [sortDirection, setSortDirection] = useState<Sort | undefined>(Sort.ASC);
  const [checkboxState, setCheckboxState] = useState(filterMenu);
  const { oamRole, email: signedEmail } = useJWTContext();
  const accessControl = useMemo(
    () =>
      new AccessControlModel(
        { signedRole: oamRole as OAMRole, signedEmail },
        oms,
        oss,
        omsUsersCount,
        count,
      ),
    [oamRole, signedEmail, oms, oss, omsUsersCount, count],
  );

  const isUserItemChecked = useCallback(
    (item: IUsers) => !!checkedUsersMap.get(item.id),
    [checkedUsersMap],
  );
  const usersMapValues = Array.from(usersMap.values());
  const isAllChecked =
    usersMap.size > 0 &&
    usersMapValues.every((item) =>
      accessControl.isItemCheckable(item) ? isUserItemChecked(item) : true,
    );
  const indeterminate =
    usersMap.size > 0 && usersMapValues.some((item) => isUserItemChecked(item)) && !isAllChecked;
  const isAllNotCheckable = usersMapValues.every((item) => !accessControl.isItemCheckable(item));

  const [isError, setIsError] = useState('');
  const [searchParams, setSearchParams] = useState<SearchUsers>({ limit, searchWord: '' });
  const [deleteOrganizationUser, deleteOrganizationStatus] = useDeleteOrganizationUserMutation();
  const [updateMultiOrganizationUserRoles, updateMultiRoleStatus] =
    useUpdateMultiOrganizationUserRolesMutation();
  const [sendOrganizationsUserInvitation, resendStatus] =
    useSendOrganizationUserInvitationMutation();
  const [allTableData, setAllTableData] = useState<UserData[]>([]);
  const [displayTableData, setDisplayTableData] = useState<UserData[]>([]);
  const [currentDataCount, setCurrentDataCount] = useState(1);
  const [tableBody, setTableBody] = useState<JSX.Element[]>([]);
  const [filterRole, setFilterRole] = useState<FilterRole>({
    oamRole: [],
    ossRole: [],
    omsRole: [],
  });
  const [userCheckResult, setUserCheckResult] = useState<PackageStatusCheckResult>({
    count: 0,
    limit: 0,
    status: PackageStatus.Normal,
  });
  const { isOAMUserExpried, isOAMUserUpgrade } = useSelector(selectLicenseNotification);
  const [upsertNotificationFlag] = useUpsertNotificationFlagMutation();
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    let userStatus: PackageStatus;
    if (oms.userLimit === -1) {
      userStatus = PackageStatus.Expired;
    } else if (omsUsersCount > oms.userLimit) {
      userStatus = PackageStatus.ExceededLimit;
    } else {
      userStatus = PackageStatus.Normal;
    }

    setUserCheckResult({
      count: omsUsersCount,
      limit: oms.userLimit,
      status: userStatus,
    });

    if (!isOAMUserExpried && userStatus === PackageStatus.Expired) {
      setNotificationVisible(true);
    } else if (!isOAMUserUpgrade && userStatus === PackageStatus.ExceededLimit) {
      setNotificationVisible(true);
    } else {
      setNotificationVisible(false);
    }
  }, [omsUsersCount, oms.userLimit, isOAMUserExpried, isOAMUserUpgrade]);

  useEffect(() => {
    checkedUsersDataAction.reset();
  }, [accessControl.ossUserCount]);

  const allUsersData: UserData[] = Array.from(usersMap, ([key, item]) => ({
    ...item,
    key,
    checked: isUserItemChecked(item),
    onChange: () => {
      checkedUsersDataAction.set(item.id, !isUserItemChecked(item));
    },
  }));

  useEffect(() => {
    setAllTableData(allUsersData);
  }, [usersMap]);

  useEffect(() => {
    setAllTableData(allUsersData);
  }, [checkedUsersMap]);

  const sortUsers = (array: UserData[]) => {
    let sortedUserData = [...array];
    if (!searchParams.sort) {
      sortedUserData = sortedUserData.sort((a, b) => {
        const dateA = new Date(a.createdDatetime);
        const dateB = new Date(b.createdDatetime);
        return dateB.getTime() - dateA.getTime();
      });
    }

    if (searchParams.sort === Sort.ASC) {
      sortedUserData = sortedUserData.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
    } else if (searchParams.sort === Sort.DESC) {
      sortedUserData = sortedUserData.sort((a, b) => b.name.localeCompare(a.name, 'zh-Hant'));
    }

    sortedUserData = sortedUserData.sort((a, b) => {
      const aVal = a.oamRole === Role.OAM_ROLE_OWNER ? -99 : a.id === account.id ? -98 : 0;
      const bVal = b.oamRole === Role.OAM_ROLE_OWNER ? -99 : b.id === account.id ? -98 : 0;
      return aVal - bVal;
    });

    return sortedUserData;
  };

  const filterBySearchword = (array: UserData[]) => {
    const result = array;
    if (searchParams.searchWord) {
      return result.filter((item) =>
        item.name.toLowerCase().includes(String(searchParams.searchWord?.toLowerCase())),
      );
    }
    return result;
  };

  const filterByRole = (array: UserData[]) => {
    let result = array;
    if (searchParams.oamRole && searchParams.oamRole.length > 0) {
      result = result.filter((item) => searchParams.oamRole?.includes(item.oamRole));
    }
    if (searchParams.omsRole && searchParams.omsRole.length > 0) {
      result = result.filter((item) => searchParams.omsRole?.includes(item.omsRole));
    }
    if (searchParams.ossRole && searchParams.ossRole.length > 0) {
      result = result.filter((item) => searchParams.ossRole?.includes(item.ossRole));
    }
    return result;
  };

  const chunkTableData = (array: UserData[]) => {
    const skip = (page - 1) * limit;
    const take = skip + limit;
    if (!array.length) {
      return [];
    }
    return array.slice(skip, take);
  };

  useEffect(() => {
    let displayData = sortUsers(allTableData);
    displayData = filterBySearchword(displayData);
    displayData = filterByRole(displayData);
    setDisplayTableData(chunkTableData(displayData));
    setCurrentDataCount(displayData.length);
  }, [allTableData]);

  const fetchOrganizationUserDelete = async (payload: DeleteUserPayload) => {
    try {
      const id = 'showDelete';
      oamNotificationsShowUntil(
        {
          id,
          title: t('Deleting_user'),
        },
        {
          waitFn: deleteOrganizationUser,
          params: [payload],
        },
        {
          title: t('User_deleted'),
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserResendInvitation = async (email: string) => {
    const id = 'sendEmail';
    try {
      const result = await oamNotificationsShowUntil(
        {
          id,
          title: t('Sending_email'),
        },
        {
          waitFn: sendOrganizationsUserInvitation,
          params: [{ email }],
        },
        {
          title: t('Sending_email'),
        },
      );
    } catch (error: any) {
      setIsError(error.response.data.errorMessage);
      console.error(error);
    }
  };

  const fetchUsersData = async () => {
    try {
      await getOrganizationUsers(searchParams);
    } catch (error) {
      console.error(error);
    }
  };

  useEffectOnce(() => {
    fetchUsersData();
  });

  const setSortField = (field: keyof RowData) => {
    const sort = sortBy === field ? (sortDirection === Sort.ASC ? Sort.DESC : undefined) : Sort.ASC;
    const nextSortBy = sort === undefined ? undefined : field;

    const { sort: _sort, sortBy: _sortBy, ...params } = searchParams;
    const updatedSearchParams = {
      ...params,
      ...(sort ? { sort } : {}),
      ...(nextSortBy ? { sortBy: nextSortBy } : {}),
    };
    setSortDirection(sort);
    setSortBy(nextSortBy);
    setSearchParams(updatedSearchParams);
  };

  function updateRoleFilter(
    roles: string[],
    filter: {
      label: string;
      value: Role;
      checked: boolean;
    },
  ) {
    const filterOutRole = roles!.filter((role) => role !== filter.value);
    return filter.checked ? [...filterOutRole, filter.value] : filterOutRole;
  }

  const handleSearchChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prevState) => ({
      ...prevState,
      searchWord: value.target.value,
    }));
  };

  const handleFilter = (index: number) => {
    const updatedCheckboxState = [...checkboxState];
    updatedCheckboxState[index!].checked = !updatedCheckboxState[index!].checked;

    let { oamRole = [], omsRole = [], ossRole = [] } = searchParams;
    updatedCheckboxState.forEach((filter) => {
      switch (filter.value) {
        case Role.OAM_ROLE_OWNER: {
          oamRole = updateRoleFilter(oamRole!, filter);
          break;
        }
        // case Role.OAM_ROLE_POWER_USER: {
        //   oamRole = updateRoleFilter(oamRole!, filter);
        //   break;
        // }
        // case Role.OAM_ROLE_USER: {
        //   oamRole = updateRoleFilter(oamRole!, filter);
        //   break;
        // }
        case Role.OMS_ROLE_ADMIN: {
          omsRole = updateRoleFilter(omsRole!, filter);
          break;
        }
        case Role.OMS_ROLE_POWER_USER: {
          omsRole = updateRoleFilter(omsRole!, filter);
          break;
        }
        case Role.OMS_ROLE_USER: {
          omsRole = updateRoleFilter(omsRole!, filter);
          break;
        }
        case Role.OMS_ROLE_UNDEFINED: {
          omsRole = updateRoleFilter(ossRole!, filter);
          break;
        }
        case Role.OSS_ROLE_PAID: {
          ossRole = updateRoleFilter(ossRole!, filter);
          break;
        }
        case Role.OSS_ROLE_FREE: {
          ossRole = updateRoleFilter(ossRole!, filter);
          break;
        }
        default:
          break;
      }
    });

    setCheckboxState(() => updatedCheckboxState);
    return {
      oamRole,
      omsRole,
      ossRole,
    };
  };

  const updateUserRole = async (data: IOrganizationUserRole | Array<IOrganizationUserRole>) => {
    const result = await updateMultiOrganizationUserRoles(Array.isArray(data) ? data : [data]);
    if ('error' in result) {
      if ('data' in result.error) {
        const errorData = result.error?.data as any;
        oamNotifications.show({
          title: `Error: ${errorData.message}`,
        });
      }
    }
  };
  useEffect(() => {
    if (!updateMultiRoleStatus.isSuccess) {
      return;
    }
    oamNotifications.show({
      title: t('Setting_successfully'),
    });
  }, [updateMultiRoleStatus]);

  const { askTransferOwner, maybeAskTransfer, maybeAskTransferDelete } = useUserDataTransfer();

  const handleRoleSetting = useCallback(
    async (user: IUsers, roleType: string, roleItem: string | unknown) => {
      if (!roleItem) {
        return;
      }
      const { id, email, oamRole, omsRole, ossRole } = user;
      switch (roleType) {
        case 'oam':
          if (roleItem === Role.OAM_ROLE_OWNER) {
            askTransferOwner(
              user.id,
              user.name,
              account.id,
              accessControl.getOldOwnerNewOmsRole(omsRole),
            );
            break;
          }
          const newOmsRole = accessControl.getCountPreservedAutoOmsRole(
            roleItem as OAMRole,
            omsRole,
          );
          const { proceed: oamProceed, transferToId: oamTransferToId } = await maybeAskTransfer(
            [user],
            [{ omsRole: newOmsRole }],
          );
          oamProceed &&
            updateUserRole({
              id,
              email,
              oamRole: roleItem as string,
              omsRole: newOmsRole,
              ossRole,
              transferToId: oamTransferToId,
            });
          break;
        case 'oms':
          //if change the same role, do nothing
          if (user.omsRole === roleItem) {
            break;
          }
          if (accessControl.isOmsRoleUpdateLimited(omsRole, roleItem as OMSRole)) {
            message.open({
              tit: t('Reach_limit_oms_plan'),
              msg: t('Reach_limit_oms_plan_content'),
              rightBtn: t('Ok'),
            });
            break;
          }
          const { proceed: omsProceed, transferToId: omsTransferToId } = await maybeAskTransfer(
            [user],
            [{ omsRole: roleItem as OMSRole }],
          );
          omsProceed &&
            updateUserRole({
              id,
              email,
              oamRole,
              omsRole: roleItem as string,
              ossRole,
              transferToId: omsTransferToId,
            });
          break;
        case 'oss':
          updateUserRole({ id, email, ossRole: roleItem as string });
          break;
        default:
          break;
      }
    },
    [accessControl, askTransferOwner, maybeAskTransfer],
  );

  const maybeTransferDelete = async (users: IUsers[]) => {
    const { proceed, itemSetNeedTransfer, transferToId } = await maybeAskTransferDelete(users);
    if (!proceed) {
      return;
    }
    if (!transferToId) {
      fetchOrganizationUserDelete({ emails: users.map(({ email }) => email) });
      return;
    }
    const groupedUsers = groupBy(users, (user) =>
      itemSetNeedTransfer!.has(user.id) ? 'transferred' : 'nonTransferred',
    );
    fetchOrganizationUserDelete({
      emails: groupedUsers.nonTransferred && groupedUsers.nonTransferred.map(({ email }) => email),
      transferredEmails:
        groupedUsers.transferred && groupedUsers.transferred.map(({ email }) => email),
      transferToId,
    });
  };

  function getUserSettingMenu(user: IUsers) {
    if (!user.canEdit) return [];
    const userSettingMenu = [
      {
        label: t('Edit'),
        value: userSettingType.edit.toString(),
        disabled: !accessControl.isItemEditable(user),
        onClick: () => {
          router.push({
            pathname: `/users/editUser/${user.accountId}`,
          });
        },
      },
      {
        label: t('Delete'),
        value: userSettingType.delete.toString(),
        disabled: !accessControl.isItemDeletable(user),
        onClick: () => {
          maybeTransferDelete([user]);
        },
      },
      {
        label: t('Resend_verification'),
        value: userSettingType.resend_verification.toString(),
        disabled: !!user.emailConfirm,
        onClick: () => {
          fetchUserResendInvitation(user?.email!);
        },
      },
    ];
    return userSettingMenu.filter(({ disabled }) => !disabled);
  }

  const filterItem = filterMenu.map((item, index) => (
    <Menu.Item closeMenuOnClick={false} key={item.label} className={classes.filterItem}>
      <Checkbox
        style={{ justifyContent: 'start' }}
        label={item.label}
        checked={checkboxState[index].checked}
        onChange={() => setFilterRole(handleFilter(index))}
      />
    </Menu.Item>
  ));

  const multiAssignRole = useCallback(
    async (itemValue: string) => {
      const selectedUsers = Array.from(usersMap.values()).filter(
        (data) => isUserItemChecked(data) && data.emailConfirm,
      );
      if (selectedUsers.length <= 0) {
        return;
      }
      const [kind, role] = JSON.parse(itemValue);
      if (role === Role.OAM_ROLE_OWNER) {
        const newOwner = selectedUsers[0];
        askTransferOwner(
          newOwner.id,
          newOwner.name,
          account.id,
          accessControl.getOldOwnerNewOmsRole(newOwner.omsRole),
        );
        return;
      }
      const updatedUserRoles = selectedUsers.map(
        ({ id, email, oamRole: oldOamRole, omsRole: oldOmsRole }) => ({
          id,
          email,
          oamRole: kind === 'oam' ? role : kind === 'oms' ? oldOamRole : undefined,
          omsRole:
            kind === 'oms'
              ? role
              : kind === 'oam'
              ? accessControl.getCountPreservedAutoOmsRole(role as OAMRole, oldOmsRole)
              : undefined,
          ossRole: undefined,
        }),
      );
      const usersDelta = updatedUserRoles.reduce(
        (usersDelta, user, userIndex) =>
          usersDelta +
          accessControl.getOmsUserDelta(selectedUsers[userIndex].omsRole, user.omsRole),
        0,
      );
      if (!accessControl.omsUsersAddable(usersDelta)) {
        if (userCheckResult.status === PackageStatus.Expired) {
          return;
        }
        message.open({
          tit: t('Reach_limit_oms_plan'),
          msg: t('Reach_limit_oms_plan_content'),
          rightBtn: t('Ok'),
        });
        return;
      }
      const { proceed, itemSetNeedTransfer, transferToId } = await maybeAskTransfer(
        selectedUsers,
        updatedUserRoles,
      );
      if (!proceed) {
        return;
      }
      updateUserRole(
        updatedUserRoles.map((user) =>
          itemSetNeedTransfer?.has(user.id) ? { ...user, transferToId } : user,
        ),
      );
    },
    [usersMap, accessControl, isUserItemChecked, askTransferOwner, account, maybeAskTransfer],
  );

  const [importOrganizationUser, importStatus] = useImportOrganizationUserMutation();
  const fetchUsersImport = async () => {
    if (!file) return;
    try {
      loadingPopup.open();
      const formData = new FormData();
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        const blob = new Blob([new Uint8Array(e.target!.result as ArrayBuffer)], {
          type: file.type,
        });
        formData.append('file', blob);
      });

      reader.addEventListener('loadend', async (e) => {
        try {
          loadingPopup.open();
          const res = await importOrganizationUser(formData);
          setFile(null);

          if (!('data' in res)) {
            message.open({
              tit: t('Error'),
              msg:
                'data' in res.error &&
                typeof res.error.data === 'object' &&
                'message' in (res.error.data as object)
                  ? (
                      res.error?.data as {
                        message?: string;
                      }
                    ).message
                  : t('Unknown_error'),
              rightBtn: t('Ok'),
            });
          } else {
            const msgArray = [];

            if (res.data.data.failed.isDuplicated) {
              msgArray.push(t('Some_Email_already_exists'));
            }

            if (res.data.data.failed.requiredMissing) {
              msgArray.push(t('Required_fields_missing_content'));
            }

            if (res.data.data.failed.nfcFormatError) {
              msgArray.push(t('Nfc_format_error_content'));
            }

            if (msgArray.length == 0) {
              oamNotifications.show({
                title: t('User_added'),
                message: '',
              });
            } else {
              message.open({
                tit: res.data.data.failed.requiredMissing
                  ? t('Required_fields_missing_title')
                  : t('Error'),
                msg:
                  msgArray.length > 1 ? (
                    <>
                      {msgArray.map((s) => (
                        <>
                          <li>{s}</li>
                          <br />
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      {msgArray.pop()}
                      <br />
                      <br />
                    </>
                  ),
                rightBtn: t('Ok'),
              });
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          loadingPopup.close();
        }
      });

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
    } finally {
      importFilePopupActions.close();
    }
  };

  const onAllChecked = () => {
    Array.from(usersMap.values())
      .filter((item) => accessControl.isItemCheckable(item))
      .forEach((item) => {
        checkedUsersDataAction.set(item.id, !isAllChecked);
      });
  };

  useEffect(() => {
    let displayData = sortUsers(allTableData);
    displayData = filterBySearchword(displayData);
    displayData = filterByRole(displayData);
    setDisplayTableData(chunkTableData(displayData));
    setCurrentDataCount(displayData.length);
  }, [searchParams.sort, searchParams.offset]);

  useEffect(() => {
    checkedUsersDataAction.reset();
    setCurrentDataCount(displayTableData.length);
  }, [searchParams.searchWord, searchParams.oamRole, searchParams.omsRole, searchParams.ossRole]);

  useEffect(() => {
    if (currentDataCount > 0) {
      setPage(1);
    }
  }, [currentDataCount]);

  useEffect(() => {
    if (isError) {
      oamNotifications.show({
        title: `Error: ${isError}`,
      });
    }
    setIsError('');
  }, [isError]);

  useEffect(() => {
    if (file) {
      fetchUsersImport();
    }
  }, [file]);

  const assignableUserItems = Array.from(usersMap.values()).filter(
    (item) => isUserItemChecked(item) && item.emailConfirm,
  );
  const actions = [
    {
      icon: <PlusDarkIcon />,
      text: t('Add_user'),
      action: () => router.push('/users/addUser'),
      // disabled: true, // for test disabled
    },
    {
      icon: <UserImportIcon />,
      text: t('Import_user'),
      action: () => {
        importFilePopupActions.open();
      },
    },
    {
      icon: <UserAssignIcon />,
      action: () => {},
      text: t('Assign'),
      disabled: assignableUserItems.length === 0,
      dropdown: [
        {
          label: t('OAM'),
          value: 'oam',
          subMenu: roleOptionsTranslator(
            accessControl.getMultiAssignableOamRoles(assignableUserItems),
          ).reverse(),
        },
        {
          label: t('OMS'),
          value: 'oms',
          subMenu: roleOptionsTranslator(
            accessControl.getMultiAssignableOmsRoles(assignableUserItems),
          ),
        },
      ],
      onDropdownItemClick: multiAssignRole,
    },
    {
      icon: <UserDeleteIcon />,
      action: () => {
        const users = Array.from(usersMap.values()).filter((item) => isUserItemChecked(item));
        maybeTransferDelete(users);
      },
      text: t('Delete'),
      disabled:
        Array.from(usersMap.values()).filter(
          (item) => isUserItemChecked(item) && item.id !== account.id,
        ).length === 0,
    },
  ];

  const withTooltip = (children: JSX.Element, tooltip: string, isTooltip: boolean) =>
    isTooltip ? (
      <>
        {children.props.children.map((node: React.ReactNode, index: number) => (
          <Tooltip key={`tooltip-${index}`} position="top" label={tooltip} styles={tooltipStyles()}>
            {node}
          </Tooltip>
        ))}
      </>
    ) : (
      children
    );

  const isTableItemCheckable = useCallback(
    (item: IUsers) => accessControl.isItemCheckable(item),
    [accessControl],
  );

  useEffect(() => {
    const newTableBody = displayTableData.map((item: UserData) =>
      withTooltip(
        <div key={item.key}>
          <Checkbox
            checked={item.checked}
            onChange={item.onChange}
            disabled={!isTableItemCheckable(item as IUsers)}
          />
          <Text fz="sm" fw={500}>
            {`${item.name}${
              item.id === account.id ? ' (you)' : item.emailConfirm ? '' : ' (inactive)'
            }`}
          </Text>
          <Select
            customType={OAMSelectType.SUBTLE}
            data={roleOptionsTranslator(
              accessControl.getAssignableOamRoles(item.oamRole).reverse(),
            )}
            value={item.oamRole as Role}
            onChange={(value) => handleRoleSetting(item, 'oam', value)}
            variant="unstyled"
            placeholder={OamRole.filter(({ value }) => value === item.oamRole)[0].label}
            disabled={
              accessControl.isItemOamRoleDisabled(item) ||
              (omsUsersCount > oms.userLimit && oamRole === Role.OAM_ROLE_POWER_USER)
            }
            mb={0}
            ml={-4}
            mr={-16}
            autoSelect
          />
          <Select
            customType={OAMSelectType.SUBTLE}
            error={userCheckResult.status === PackageStatus.ExceededLimit}
            data={roleOptionsTranslator(
              accessControl.getAssignableOmsRoles(
                item.oamRole,
                item.omsRole,
                item.id === account.id,
              ),
            )}
            value={item.omsRole as Role}
            onChange={(value) => handleRoleSetting(item, 'oms', value)}
            variant="unstyled"
            placeholder={OmsRole.filter(({ value }) => value === item.omsRole)[0].label}
            disabled={
              accessControl.isItemOmsRoleDisabledNoLimit(item) ||
              oms.userLimit <= 0 ||
              (omsUsersCount > oms.userLimit && oamRole === Role.OAM_ROLE_POWER_USER)
            }
            mb={0}
            ml={-4}
            mr={-16}
            autoSelect
          />
          <Select
            customType={OAMSelectType.SUBTLE}
            data={roleOptionsTranslator(OssRole)}
            value={item.ossRole as Role}
            onChange={(value) => handleRoleSetting(item, 'oss', value)}
            variant="unstyled"
            disabled
            mb={0}
            ml={-4}
            mr={-16}
            autoSelect
          />
          <Text fz="sm">{item.nfc01}</Text>
          <Text fz="sm">{item.nfc02}</Text>
          <Group spacing={0} position="right">
            <ActionsMenu actions={getUserSettingMenu(item)} />
          </Group>
        </div>,
        t('This_user_is_not_created_by_you'),
        !item.canEdit,
      ),
    );
    setTableBody(newTableBody);
  }, [displayTableData, handleRoleSetting, accessControl, t, oms]);

  const notificationDic: Record<
    PackageStatus,
    { key: string; bgColor?: string; title?: string; message?: string }
  > = {
    [PackageStatus.Expired]: {
      key: 'isOAMUserExpried',
      bgColor: '#F26600',
      title: t('Oms_license_expired_title', { plan: '' }) as string,
      message: t('Oms_expired_notification') as string,
    },
    [PackageStatus.Normal]: {
      key: '',
      bgColor: undefined,
      title: undefined,
      message: undefined,
    },
    [PackageStatus.ExceededLimit]: {
      key: 'isOAMUserUpgrade',
      bgColor: '#F26600',
      title: `${t('Upgrade')} OMS`,
      message: t('Oms_user_exceeded_notification') as string,
    },
  };

  const handleCloseNotification = async (flagKey: string) => {
    await upsertNotificationFlag({ key: flagKey });
  };

  const renderNotification = (state: PackageStatus) => {
    const content = notificationDic[state];
    return (
      isNotificationVisible && (
        <Notification
          radius="md"
          mb="md"
          bg={content.bgColor}
          title={content.title}
          onClose={async () => {
            await handleCloseNotification(content.key);
          }}
          styles={() => ({
            root: {
              overflow: 'visible',
              height: rem(75),
              '&::before': {
                display: 'none',
              },
              [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)})`]: {
                height: rem(110),
              },
            },
            title: {
              color: '#FFFFFF',
              fontSize: rem(16),
            },
            description: {
              color: '#FFFFFF',
              fontSize: rem(14),
            },
            closeButton: {
              borderRadius: '50%',
              position: 'absolute',
              top: rem(-8),
              right: rem(-8),
              color: '#000000',
              background: '#FFFFFF',
              border: '1px solid #F2F2F2',
              '&:hover': {
                background: '#F2F2F2 !important',
              },
            },
          })}
        >
          {content.message}
        </Notification>
      )
    );
  };

  return (
    <>
      <Container fluid px="lg" pb={60}>
        <Breadcrumbs start={1} />
        {ossStatus.isUninitialized ||
        getOrganizationUsersStatus.isFetching ||
        updateMultiRoleStatus.isLoading ||
        deleteOrganizationStatus.isLoading ? (
          <LoadingOverlay
            overlayBlur={2}
            zIndex={1}
            loader={CustomLoader({ loadingText: t('Loading') })}
            visible
          />
        ) : (
          <>
            <MediaQuery
              query={`(max-width: ${em(
                getBreakpointValue(theme.breakpoints.sm) - 1,
              )}) and (min-width: 20em)`}
              styles={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Grid mb="md">
                <Grid.Col xs={12} sm={3}>
                  <Card padding={0} shadow="sm" radius="md" withBorder>
                    <Flex
                      style={{ height: rem(90) }}
                      p="md"
                      direction="column"
                      justify="space-between"
                    >
                      <Text>{t('OMS_users')}</Text>
                      <Text size={24}>
                        {oms.userLimit === -1 ? (
                          `${omsUsersCount}/0`
                        ) : oms.userLimit >= omsUsersCount ? (
                          `${omsUsersCount}/${oms.userLimit}`
                        ) : (
                          <>
                            <span style={{ color: '#E4002B' }}>{omsUsersCount}</span>/
                            {oms.userLimit}
                          </>
                        )}
                      </Text>
                    </Flex>
                  </Card>
                </Grid.Col>
                <Grid.Col xs={12} sm={3}>
                  <Card padding={0} shadow="sm" radius="md" withBorder>
                    <Flex
                      style={{ height: rem(90) }}
                      p="md"
                      direction="column"
                      justify="space-between"
                    >
                      <Text>{t('OSS Advanced')}</Text>
                      <Text size={24}>{`${count}`}</Text>
                    </Flex>
                  </Card>
                </Grid.Col>
              </Grid>
            </MediaQuery>
            {renderNotification(userCheckResult.status)}
            <ActionBar
              searchValue={searchParams.searchWord || ''}
              onChangeSearch={handleSearchChange}
              onClearSearch={() =>
                setSearchParams((prevState) => ({
                  ...prevState,
                  searchWord: '',
                }))
              }
              filterItem={filterItem}
              actions={actions}
              isAllChecked={!isAllNotCheckable && isAllChecked}
              indeterminate={indeterminate}
              checkAllDisabled={isAllNotCheckable}
              onAllChecked={onAllChecked}
              onFilter={() => {
                const { oamRole, omsRole, ossRole } = filterRole;
                setSearchParams({ ...searchParams, oamRole, omsRole, ossRole });
              }}
              haveButton
            />
            <UsersTable
              isLoading={
                ossStatus.isLoading ||
                getOrganizationUsersStatus.isFetching ||
                updateMultiRoleStatus.isLoading ||
                deleteOrganizationStatus.isLoading
              }
              isAllChecked={!isAllNotCheckable && isAllChecked}
              indeterminate={indeterminate}
              checkAllDisabled={isAllNotCheckable}
              onAllChecked={onAllChecked}
              sorted={sortBy === 'name'}
              reverseSortDirection={sortDirection !== Sort.ASC}
              onSort={() => {
                setSortField('name');
              }}
              page={page}
              total={Math.ceil(currentDataCount / limit)}
              onChangePage={(page: number) => {
                const offset = (page - 1) * limit;
                const updateSearchParams = {
                  ...searchParams,
                  offset,
                };
                setPage(page);
                setSearchParams(updateSearchParams);
              }}
              placeholder="No Data"
              tableHead={[
                <div style={{ minWidth: rem(65) }}>{t('OAM_role')}</div>,
                <Flex align="center" miw={65}>
                  {t('OMS_role')}
                  <Tooltip
                    position="top"
                    label={t('If_you_want_to_assign_power_user_to_OMS')}
                    styles={{
                      tooltip: {
                        color: '#000',
                        borderRadius: rem(6),
                        border: `${rem(1)} solid var(--gray-cccccc, #CCC)`,
                        background: 'var(--gray-ffffff, #FFF)',
                        boxShadow: `0 ${rem(1)} ${rem(2)} 0 rgba(0, 0, 0, 0.16)`,
                        fontWeight: 400,
                      },
                    }}
                  >
                    <div>
                      <InfoIcon className={classes.icon} />
                    </div>
                  </Tooltip>
                </Flex>,
                t('OSS_role'),
                t('NFC_card_01'),
                t('NFC_card_02'),
              ]}
              tableBody={tableBody}
            />
          </>
        )}
      </Container>

      <Dialog
        customType={OAMDialogType.FORM}
        opened={importFilePopupOpened}
        onClose={importFilePopupActions.close}
        title={t('Import_user')}
        rightButton={t('Import')}
        leftButton={t('Cancel')}
        onRightClick={() => {}}
        isValid
        formSubmit={(event) => {
          event.preventDefault();
          const { current } = ref;
          if (!current) return;
          current.click();
        }}
        onLeftClick={importFilePopupActions.close}
      >
        <Text my="md" fz="sm">
          {t('Importing_users_content')}
        </Text>
        <Group>
          <Text my="md" fz="sm">
            {t('Download_template')}
          </Text>
          <Anchor
            fz="md"
            color="#465EE3"
            href="/assets/user_import_template.xlsx?v002" // always increase version number after modifying to avoid browser caching.
            target="_blank"
          >
            {t('Here')}
          </Anchor>
        </Group>
        <FileInput display="none" ref={ref} accept=".xlsx" value={file} onChange={setFile} />
      </Dialog>
    </>
  );
}

export default Users;

Users.requireAuth = true;
