import React, { useEffect, useState, useMemo } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  Group,
  Text,
  rem,
  Container,
  LoadingOverlay,
  Anchor,
  Menu,
  ActionIcon,
  useMantineTheme,
  em,
  getBreakpointValue,
  Card,
  Grid,
  MediaQuery,
  Notification,
  Flex,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useMap } from 'usehooks-ts';
import { IconDots } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { RefreshIcon, PlusDarkIcon, DeleteIcon, SuccessIcon } from '../../components/base/icon';
import Checkbox from '../../components/base/Checkbox';
import { oamNotificationsShowUntil } from '../../components/base/Notifications';
import {
  DeviceInfo,
  IDevice,
  OmsAccountInfo,
  Sort,
  deviceSettingType,
  PackageStatus,
  PackageStatusCheckResult,
} from '../../utils/types';
import ActionBar from '../../components/actionBar';
import { CustomLoader } from '../../components/customLoader';
import {
  useDeleteDevicesMutation,
  useDeleteGatewayDevicesMutation,
  useLazyGetDevicesQuery,
  useNotifyCreateAccountMutation,
  useUpdateDeviceMutation,
  useUpdateUserMutation,
  useUpdateOrganizationMutation,
  useUpsertNotificationFlagMutation,
} from '../../store/services';
import useExchangeToken from '../../hooks/useExchangeToken';
import { usePopup } from '../../providers/popupProvider';
import OAMTextInput, { OAMTextInputType } from '../../components/base/TextInput';
import { useSelector } from '../../store';
import {
  selectAccount,
  selectDevices,
  selectOmsInfo,
  selectOrganization,
  selectLicense,
  selectLicenseNotification,
} from '../../store/slices';
import useModal from '../../hooks/useModal';
import OMSAccountDialog from '../../components/OMSAccountDialog';
import { Role } from '../../utils/role';
import { SortTh } from '../../components/base/Table';
import { useJWTContext } from '../../providers/jwtProvider';
import useOmsRole from '../../hooks/useOmsRole';
import { formatToDate } from '../../utils/date';

const useStyles = createStyles((theme) => ({
  title: {
    color: '#415284',
    fontWeight: 500,
  },
  text: {
    justifyContent: 'center',
    gap: 0,
    whiteSpace: 'pre-wrap',
  },
  headerTable: {
    position: 'sticky',
    top: 0,
    height: rem(48),
    backgroundColor: '#F2F2F2',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${theme.colors.gray[2]}`,
    },
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(234, 240, 247, 0.4)',
    },
  },
  table: {
    'thead tr th': {
      padding: `${rem(5)} ${rem(8)} ${rem(5)} ${rem(0)}`,
    },
    'tbody tr td': {
      padding: `${rem(10)} ${rem(8)} ${rem(10)} ${rem(0)}`,
    },
  },
}));

interface DeviceState {
  device: DeviceInfo;
  checked: boolean;
  canOperate: boolean;
  groupIds?: string[];
}

function Devices() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const { classes } = useStyles();
  const { oamRole } = useJWTContext();
  const account = useSelector(selectAccount);
  const organization = useSelector(selectOrganization);
  const { omsId, totalCount } = useSelector(selectOmsInfo);
  const devices: IDevice[] = useSelector(selectDevices);
  const [getDevices, devicesStatus] = useLazyGetDevicesQuery();
  const [updateDevice, updateDeviceStatus] = useUpdateDeviceMutation();
  const [deleteDevices, deleteDevicesStatus] = useDeleteDevicesMutation();
  const [deleteGatewayDevices, deleteGatewayDevicesStatus] = useDeleteGatewayDevicesMutation();
  const [notifyCreateAccount, notifyCreateAccountStatus] = useNotifyCreateAccountMutation();
  const { oms } = useSelector(selectLicense);
  const { message } = usePopup();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof DeviceInfo | undefined>();
  const [sortDirection, setSortDirection] = useState<Sort.ASC | Sort.DESC | undefined>(Sort.ASC);
  const [deviceData, deviceDataAction] = useMap<string, DeviceState>(new Map());
  const [editedDevice, setEditedDevice] = useState<DeviceState>();
  const [isDeleteSelect, setIsDeleteSelect] = useState(false);
  const isAllChecked: boolean = useMemo(() => {
    const canOperateDevices = Array.from(deviceData.values()).filter((item) => item.canOperate);
    return canOperateDevices.length > 0 && canOperateDevices.every((item) => item.checked);
  }, [deviceData]);
  const { tokenInfo, isSuccess, isLoading } = useExchangeToken();
  const [dialogOpened, dialogActions] = useDisclosure(!tokenInfo!.isCompletedAccountInfo);
  const omsRole = useOmsRole(account.accountId);
  const [deviceCheckResult, setDeviceCheckResult] = useState<PackageStatusCheckResult>({
    count: 0,
    limit: 0,
    status: PackageStatus.Normal,
  });
  const { isOAMDeviceExpried, isOAMDeviceUpgrade } = useSelector(selectLicenseNotification);
  const [upsertNotificationFlag] = useUpsertNotificationFlagMutation();
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const dateFormat = useSelector((state) => state.account.formatDate) as string;

  const setSortName = (field: keyof DeviceInfo) => {
    const sort =
      sortBy === field ? (sortDirection === Sort.DESC ? Sort.ASC : undefined) : Sort.DESC;
    const nextSortBy = sort === undefined ? undefined : field;

    setSortDirection(sort);
    setSortBy(nextSortBy);
    getDevices({
      search,
      sortBy: nextSortBy,
      sort,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      getDevices({
        search,
        sortBy: '',
        sort: sortDirection,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    const deviceCount = new Set(devices.map((device) => device.sn)).size;

    let deviceStatus: PackageStatus;
    if (oms.deviceLimit === -1) {
      deviceStatus = PackageStatus.Expired;
    } else if (deviceCount > oms.deviceLimit) {
      deviceStatus = PackageStatus.ExceededLimit;
    } else {
      deviceStatus = PackageStatus.Normal;
    }

    setDeviceCheckResult({
      count: deviceCount,
      limit: oms.deviceLimit,
      status: deviceStatus,
    });

    if (!isOAMDeviceExpried && deviceStatus === PackageStatus.Expired) {
      setNotificationVisible(true);
    } else if (!isOAMDeviceUpgrade && deviceStatus === PackageStatus.ExceededLimit) {
      setNotificationVisible(true);
    } else {
      setNotificationVisible(false);
    }
  }, [devicesStatus, oms.deviceLimit, isOAMDeviceExpried, isOAMDeviceUpgrade]);

  useEffect(() => {
    if (
      oamRole === Role.OAM_ROLE_POWER_USER &&
      deviceCheckResult.status === PackageStatus.ExceededLimit
    ) {
      message.open({
        tit: `${t('Upgrade')} OMS`,
        msg: t('Upgrade_oms_device_content'),
        rightBtn: t('Ok'),
        rightBtnClick: async () => {
          router.back();
        },
      });
    }
  }, [deviceCheckResult]);

  const indeterminate: boolean =
    deviceData.size > 0 &&
    Array.from(deviceData.values())
      .filter((item) => item.canOperate)
      .some((item) => item.checked) &&
    !isAllChecked;

  const isAllNotCheckable = Array.from(deviceData.values()).every((item) => !item.canOperate);

  useEffect(() => {
    if (!omsRole) {
      return;
    }
    !tokenInfo.isCompletedAccountInfo &&
      omsRole !== Role.OMS_ROLE_UNDEFINED &&
      dialogActions.open();
  }, [tokenInfo.isCompletedAccountInfo, omsRole]);

  const canOperateDevice = (oamRole: string, DeviceCreatorId: string, omsId: string) => {
    switch (oamRole) {
      case 'owner':
        return true;
      case 'admin':
        return true;
      case 'power_user':
        return DeviceCreatorId === omsId;
      case 'user':
        return false;
      default:
        return false;
    }
  };

  useEffect(() => {
    deviceDataAction.setAll(
      devices.reduce(
        (map, { groups, ...deviceInfo }) =>
          map.set(deviceInfo.id ? deviceInfo.id : deviceInfo.gatewayId, {
            device: deviceInfo,
            checked: false,
            canOperate: canOperateDevice(oamRole, deviceInfo.creatorId, omsId),
          }),
        new Map<string, DeviceState>(),
      ),
    );
  }, [devices]);

  const form = useForm({
    initialValues: {
      name: '',
    },
    validateInputOnBlur: true,
    validate: {
      name: isNotEmpty(),
    },
  });
  const updateNameModal = useModal({
    title: t('Update_device'),
    content: (
      <OAMTextInput
        customType={OAMTextInputType.BORDER}
        required
        p="10px"
        w="100%"
        label={t('Name')}
        radius="md"
        defaultValue={form.values.name}
        {...form.getInputProps('name')}
      />
    ),
    leftButton: t('Cancel'),
    rightButton: t('Ok'),
  });
  const deletePopup = (onDelete: () => void) =>
    message.open({
      tit: t('Delete_device'),
      msg: t('Are_you_sure_to_delete'),
      leftBtn: t('Cancel'),
      rightBtn: t('Ok'),
      rightBtnClick: async () => {
        const id = 'onDeleteDevice';
        oamNotificationsShowUntil(
          {
            id,
            title: t('Deleting_device'),
          },
          {
            waitFn: onDelete,
          },
          {
            title: t('Device_deleted'),
          },
        );
      },
    });

  const goToAddDevice = () => {
    if (deviceCheckResult.status === PackageStatus.Normal) {
      router.push('/devices/devicesAdd');
    } else {
      message.open({
        tit: t('Reach_limit_oms_plan'),
        msg: t('Reach_limit_oms_plan_device_content'),
        rightBtn: t('Ok'),
      });
    }
  };

  const actions = [
    {
      icon: <PlusDarkIcon />,
      text: t('Add_devices'),
      action: () => {
        goToAddDevice();
      },
    },
    {
      icon: <RefreshIcon />,
      text: t('Sync_with_OMS'),
      disabled:
        !isSuccess ||
        isLoading ||
        devicesStatus.isFetching ||
        updateDeviceStatus.isLoading ||
        deleteDevicesStatus.isLoading,
      action: async () => {
        await getDevices({
          search,
          sortBy: '',
          sort: sortDirection,
        }).unwrap();
      },
    },
    {
      icon: <DeleteIcon />,
      text: t('Delete'),
      action: () =>
        deletePopup(async () => {
          const selectedData = Array.from(deviceData.values()).filter(({ checked }) => checked);
          const cloudDeviceIds = selectedData
            .filter((device) => device.device.addFrom === 'OMSC')
            .map(({ device: { id } }) => id);

          await deleteDevices({ deviceIds: cloudDeviceIds });
          const gatewayDevices = selectedData
            .filter((device) => device.device.addFrom === 'Gateway')
            .map(({ device: { gatewayId, gatewayLocalIp, ip } }) => ({
              gatewayId,
              gatewayLocalIp,
              ip: [ip],
            }));
          await Promise.all(
            gatewayDevices.map((device) =>
              deleteGatewayDevices({
                gatewayId: device.gatewayId,
                gatewayLocalIp: device.gatewayLocalIp,
                ip: device.ip,
              }),
            ),
          );
        }),
      disabled: Array.from(deviceData.values()).filter(({ checked }) => checked).length === 0,
    },
  ];

  const onAllChecked = () => {
    Array.from(deviceData.values())
      .map((item) => {
        if (item.canOperate) {
          item.checked = !isAllChecked;
        }
        return item;
      })
      .forEach((item) => {
        if (item.device.id) {
          deviceDataAction.set(item.device.id, item);
        }
      });
  };

  function deviceSettingItem(item: DeviceState) {
    const powerUserDisabled =
      oamRole === Role.OAM_ROLE_POWER_USER && item.device?.creatorId !== omsId;

    const usersettingMenu = [
      {
        label: t('Rename'),
        value: deviceSettingType.rename,
        onClick: () => {
          setEditedDevice(item);
          form.setFieldValue('name', item.device.name);
          updateNameModal.open({
            formSubmit: form.onSubmit(() => {}),
            isValid: form.isValid(),
            onLeftClick: updateNameModal.close,
            onRightClick: () => {
              updateNameModal.close();
            },
          });
        },
        disabled:
          powerUserDisabled ||
          item.device.addFrom === 'Gateway' ||
          deviceCheckResult.status === PackageStatus.ExceededLimit,
      },
      {
        label: t('Delete'),
        value: deviceSettingType.delete,
        onClick: () => {
          deletePopup(async () => {
            if (item.device.addFrom === 'OMSC') {
              await deleteDevices({ deviceIds: [item.device.id] });
            }
            if (item.device.addFrom === 'Gateway') {
              await deleteGatewayDevices({
                gatewayId: item.device.gatewayId,
                gatewayLocalIp: item.device.gatewayLocalIp,
                ip: [item.device.ip],
              });
            }
          });
        },
        disabled: powerUserDisabled,
      },
    ];

    return usersettingMenu.map((item) => (
      <Menu.Item onClick={item.onClick} key={item.label} disabled={item.disabled}>
        {item.label}
      </Menu.Item>
    ));
  }

  const handleSearch = async (search: string) => {
    await getDevices({ search, sortBy, sort: sortDirection });
  };
  const handleSearchChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(value.target.value);
  };

  useEffect(() => {
    const checkedItems = Array.from(deviceData.values()).filter((item) => item.checked);
    if (checkedItems.length > 0) {
      setIsDeleteSelect(true);
    } else {
      setIsDeleteSelect(false);
    }
  }, [deviceData]);

  useEffect(() => {
    if (deleteDevicesStatus.isSuccess) {
      getDevices({
        search,
        sortBy: '',
      });
    }
  }, [deleteDevicesStatus]);

  const data = Array.from(deviceData, ([key, item]) => ({
    key,
    checked: item.checked,
    onChange: () => {
      const device = { ...item, checked: !item.checked };
      deviceDataAction.set(item.device.id, device);
    },
    ...item.device,
  }));

  const tableHead = isMobile
    ? [
        <Checkbox
          checked={isAllChecked}
          indeterminate={indeterminate}
          transitionDuration={0}
          onChange={onAllChecked}
        />,
        t('Name'),
        t('Serial_number'),
        t('OMS Hybrid'),
        t('Device_type'),
        t('Device_owner'),
        t('Last_editor'),
        t('Last_edit_date'),
      ]
    : [
        <th key="0">
          <Checkbox
            checked={isAllChecked}
            indeterminate={indeterminate}
            transitionDuration={0}
            onChange={onAllChecked}
            disabled={isAllNotCheckable}
          />
        </th>,
        <SortTh
          key="1"
          sorted={sortBy === 'name'}
          reversed={sortDirection !== Sort.ASC}
          onSort={() => setSortName('name')}
        >
          <span style={{ marginLeft: '7px' }}>{t('Name')}</span>
        </SortTh>,
        <th key="2">{t('Serial_number')}</th>,
        <th key="3">{t('OMS Hybrid')}</th>,
        <th key="4">{t('Device_type')}</th>,
        <th key="5">{t('Device_owner')}</th>,
        <th key="6">{t('Last_editor')}</th>,
        <th key="7">{t('Last_edit_date')}</th>,
      ];

  const tableBody = isMobile ? (
    deviceData.size === 0 ? (
      <Group h={100} className={classes.text}>
        No device found.{' '}
        <Anchor align="center" onClick={() => goToAddDevice()}>
          {t('Add_device')}
        </Anchor>
      </Group>
    ) : (
      Array.from(deviceData, ([key, item]) => (
        <>
          <Checkbox
            key={key}
            checked={item.checked}
            disabled={!item.canOperate}
            onChange={() => {
              item.checked = !item.checked;
              if (item.device.id) {
                deviceDataAction.set(item.device.id, item);
              } else {
                deviceDataAction.set(item.device.gatewayId, item);
              }
            }}
          />
          <Text
            fz="sm"
            style={{
              color:
                deviceCheckResult.status === PackageStatus.ExceededLimit ? '#E4002B' : 'inherit',
            }}
          >
            {item.device.name}
          </Text>
          <Text fz="sm">{item?.device?.sn}</Text>
          {item.device.addFrom === 'OMSC' ? (
            <Text fz="sm">- -</Text>
          ) : (
            <Text ml={-8}>
              <SuccessIcon />
            </Text>
          )}
          <Text fz="sm">{item?.device?.type}</Text>
          <Text variant="unstyled">{item?.device?.creatorOAMId}</Text>
          <Text variant="unstyled">{item?.device?.modifierOAMId}</Text>
          <Text variant="unstyled">
            {item?.device?.modifiedTime
              ? formatToDate(item?.device?.modifiedTime, dateFormat).toString()
              : '- -'}
          </Text>
          {item.canOperate && (
            <Group spacing={0} position="right">
              <Menu
                transitionProps={{ transition: 'pop' }}
                withArrow
                position="bottom-end"
                withinPortal
              >
                <Menu.Target>
                  <ActionIcon>
                    <IconDots size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>{deviceSettingItem(item)}</Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </>
      ))
    )
  ) : deviceData.size === 0 ? (
    <tr className={classes.tableRow}>
      <td colSpan={10}>
        <Group h={100} className={classes.text}>
          No device found.{' '}
          <Anchor align="center" onClick={() => goToAddDevice()}>
            {t('Add_device')}
          </Anchor>
        </Group>
      </td>
    </tr>
  ) : (
    Array.from(deviceData, ([key, item]) => (
      <tr key={key} className={classes.tableRow}>
        <td>
          <Checkbox
            key={key}
            checked={item.checked}
            disabled={!item.canOperate}
            onChange={() => {
              item.checked = !item.checked;
              if (item.device.id) {
                deviceDataAction.set(item.device.id, item);
              } else {
                deviceDataAction.set(item.device.gatewayId, item);
              }
            }}
          />
        </td>
        <td>
          <Text
            fz="sm"
            style={{
              color:
                deviceCheckResult.status === PackageStatus.ExceededLimit ? '#E4002B' : 'inherit',
            }}
          >
            {item.device.name}
          </Text>
        </td>
        <td>
          <Text fz="sm">{item?.device?.sn}</Text>
        </td>
        <td>
          {item.device.addFrom === 'OMSC' ? (
            <Text fz="sm">- -</Text>
          ) : (
            <Text ml={-12}>
              <SuccessIcon />
            </Text>
          )}
        </td>
        <td>
          <Text fz="sm">{item?.device?.type}</Text>
        </td>
        <td>
          <Text variant="unstyled">{item?.device?.creatorOAMId}</Text>
        </td>
        <td>
          <Text variant="unstyled">{item?.device?.modifierOAMId}</Text>
        </td>
        <td>
          <Text variant="unstyled">
            {item?.device?.modifiedTime
              ? formatToDate(item?.device?.modifiedTime, dateFormat).toString()
              : '- -'}
          </Text>
        </td>
        <td>
          {item.canOperate && (
            <Group spacing={0} position="right">
              <Menu
                transitionProps={{ transition: 'pop' }}
                withArrow
                position="bottom-end"
                withinPortal
              >
                <Menu.Target>
                  <ActionIcon>
                    <IconDots size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>{deviceSettingItem(item)}</Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </td>
      </tr>
    ))
  );

  const notificationDic: Record<
    PackageStatus,
    { key: string; bgColor?: string; title?: string; message?: string }
  > = {
    [PackageStatus.Expired]: {
      key: 'isOAMDeviceExpried',
      bgColor: '#F26600',
      title: t('Oms_license_expired_title', { plan: '' }) as string,
      message: t('Oms_expired_notification') as string,
    },
    [PackageStatus.Normal]: { key: '', bgColor: undefined, title: undefined, message: undefined },
    [PackageStatus.ExceededLimit]: {
      key: 'isOAMDeviceUpgrade',
      bgColor: '#F26600',
      title: `${t('Upgrade')} OMS`,
      message: t('Oms_device_exceeded_notification') as string,
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

  const omsAccountData = useMemo(
    () => ({
      timezoneCode: account.timezone,
      location: organization?.country,
      state: organization?.state,
      city: organization?.city,
      address: organization?.address,
      dateFormat: account.formatDate,
    }),
    [account, organization],
  );

  const [updateUser] = useUpdateUserMutation();
  const [updateOrganization] = useUpdateOrganizationMutation();

  const onSubmitOmsAccount = async (omsAccountInfo: { omsAccountInfo: OmsAccountInfo }) => {
    const createStatus = await notifyCreateAccount(omsAccountInfo);
    if ('error' in createStatus || !createStatus.data.data.isSuccess) {
      return;
    }
    const accountInfo = omsAccountInfo.omsAccountInfo;
    const updateUserStatus = await updateUser({
      timezone: accountInfo.timezoneCode!,
      formatDate: accountInfo.dateFormat!,
      name: account.name,
      avatar: '',
      language: account.language,
    });
    if ('error' in updateUserStatus) {
      return;
    }
    // only owner can update organization info
    if (oamRole !== Role.OAM_ROLE_OWNER) {
      return;
    }
    const updateOrganizationStatus = await updateOrganization({
      updateTarget: 2,
      country: accountInfo.location,
      state: accountInfo.state,
      city: accountInfo.city,
      address: accountInfo.address,
    });
  };

  return (
    <Container fluid px="lg" pb={60}>
      <p className={classes.title}> {t('Devices')}</p>
      {devicesStatus.isUninitialized || devicesStatus.isFetching || updateDeviceStatus.isLoading ? (
        <LoadingOverlay
          overlayBlur={2}
          loader={CustomLoader({ loadingText: t('Loading') })}
          zIndex={1}
          transitionDuration={250}
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
                    <Text>{t('OMS_device')}</Text>
                    <Text size={24}>
                      {deviceCheckResult.limit === -1 ? (
                        `${deviceCheckResult.count}/0`
                      ) : deviceCheckResult.limit >= deviceCheckResult.count ? (
                        `${deviceCheckResult.count}/${deviceCheckResult.limit}`
                      ) : (
                        <>
                          <span style={{ color: '#E4002B' }}>{deviceCheckResult.count}</span>/
                          {deviceCheckResult.limit}
                        </>
                      )}
                    </Text>
                  </Flex>
                </Card>
              </Grid.Col>
            </Grid>
          </MediaQuery>
          {renderNotification(deviceCheckResult.status)}
          <ActionBar
            searchValue={search}
            onSearch={handleSearch}
            onChangeSearch={handleSearchChange}
            onClearSearch={() => setSearch('')}
            actions={actions}
            isAllChecked={isAllChecked}
            indeterminate={indeterminate}
            onAllChecked={onAllChecked}
            checkAllDisabled={isAllNotCheckable}
          />
          <ScrollArea>
            {isMobile ? (
              <>
                {!data.length && (
                  <Card withBorder shadow="sm" radius="md">
                    {tableBody}
                  </Card>
                )}
                {data.map((item: any, index: number) => (
                  <Card withBorder shadow="sm" radius="md" key={`${item.key}`} mb={20}>
                    <Card.Section
                      withBorder
                      inheritPadding
                      py="xs"
                      bg="var(--gray-f-2-f-2-f-2, #F2F2F2)"
                    >
                      <Group position="apart">
                        {(tableBody as { props: { children: React.ReactNode[] } }[])![
                          index
                        ].props.children.slice(0, 1)}
                        {(tableBody as { props: { children: React.ReactNode[] } }[])![
                          index
                        ].props.children.slice(-1)}
                      </Group>
                    </Card.Section>
                    {(tableBody as { props: { children: React.ReactNode[] } }[])![
                      index
                    ].props.children
                      .slice(1, -1)
                      .map((content, contentIndex) => (
                        <Card.Section inheritPadding py="xs" key={`section-${contentIndex + 1}`}>
                          <Grid gutter={0} grow align="center">
                            <Grid.Col
                              span={5}
                              style={{ height: rem(36), display: 'flex', alignItems: 'center' }}
                            >
                              <Text fz="sm" fw={500}>
                                {contentIndex === 0
                                  ? t('Name')
                                  : (tableHead as React.ReactNode[])[contentIndex + 1]}
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}> {content}</Grid.Col>
                          </Grid>
                        </Card.Section>
                      ))}
                  </Card>
                ))}
              </>
            ) : (
              <div
                style={{
                  padding: rem(1),
                  border: `${rem(1)} solid var(--gray-cccccc, #CCC)`,
                  borderRadius: rem(6),
                }}
              >
                <Table
                  horizontalSpacing="md"
                  verticalSpacing="xs"
                  miw={700}
                  className={classes.table}
                >
                  <thead>
                    <tr className={classes.headerTable} key="1">
                      {tableHead}
                    </tr>
                  </thead>
                  <tbody>{tableBody}</tbody>
                </Table>
              </div>
            )}
            {updateNameModal.body({
              isValid: form.isValid(),
              formSubmit: form.onSubmit(() => {
                updateDevice({
                  deviceId: editedDevice!.device.id,
                  deviceName: form.values.name,
                  ...(editedDevice?.groupIds ? { groupIds: editedDevice.groupIds } : {}),
                });
              }),
            })}
            <OMSAccountDialog
              data={omsAccountData}
              opened={dialogOpened}
              onClose={dialogActions.close}
              onSubmit={onSubmitOmsAccount}
              isOwner={oamRole === Role.OAM_ROLE_OWNER}
            />
          </ScrollArea>
        </>
      )}
    </Container>
  );
}
export default Devices;

Devices.requireAuth = true;
