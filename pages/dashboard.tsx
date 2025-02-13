import React, { useEffect, useState } from 'react';
import {
  createStyles,
  Text,
  Card,
  Grid,
  Stack,
  MediaQuery,
  useMantineTheme,
  getBreakpointValue,
  rem,
  em,
  LoadingOverlay,
  Container,
  Notification,
  Flex,
} from '@mantine/core';
import { IconExclamationMark } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'usehooks-ts';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  useLazyGetDevicesQuery,
  useLazyGetOrganizationUserCountQuery,
  useLazyOssInfoQuery,
  useUpsertNotificationFlagMutation,
  useLazyGetOMSlicenseNotificationQuery,
} from '../store/services';
import useExchangeToken from '../hooks/useExchangeToken';
import { useSelector } from '../store';
import {
  selectOmsInfo,
  selectUsers,
  selectLicense,
  selectLicenseNotification,
  selectOrganization,
  selectOMSLicenseNotification,
} from '../store/slices';
import { bitsToGigabytes } from '../utils/common';
import { CustomLoader } from '../components/customLoader';
import { formatToDate } from '../utils/date';

const useDashboardStyles = createStyles((theme) => ({
  title: {
    padding: `${rem(16)} ${rem(0)}`,
    color: 'var(--b-2-b-primary-primary-415284, #415284)',
    fontFeatureSettings: 'clig off, liga off',
  },
  grid: {
    border: '0.5px solid var(--gray-cccccc, #CCC)',
    [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)})`]: {
      border: 0,
    },
  },
}));

dayjs.extend(utc);
const cutoffDate = dayjs.utc('2024/12/31');

interface RootState {
  account: {
    formatDate: string;
  };
}

export function Dashboard() {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const { classes } = useDashboardStyles();
  const [getOrganizationUserCount, getOrganizationUserCountStatus] =
    useLazyGetOrganizationUserCountQuery();
  const [getDevices, devicesStatus] = useLazyGetDevicesQuery();
  const [getOSSLicenseInfo, ossStatus] = useLazyOssInfoQuery();
  const [getOMSLicenseNotification, omsLicenseNotificationStatus] =
    useLazyGetOMSlicenseNotificationQuery();
  const { oms, oss } = useSelector(selectLicense);
  const { totalCount } = useSelector(selectOmsInfo);
  const { omsUsersCount } = useSelector(selectUsers);
  const { isSuccess } = useExchangeToken();
  const dateFormat = useSelector((state: RootState) => state.account.formatDate);
  const organization = useSelector(selectOrganization);
  const { oamExpireNotifyCloseTime } = useSelector(selectLicenseNotification);
  const [upsertNotificationFlag] = useUpsertNotificationFlagMutation();
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const { willExpireTitleText, willExpireDescText } = useSelector(selectOMSLicenseNotification);

  useEffectOnce(() => {
    getOrganizationUserCount();
    getOSSLicenseInfo();
    getOMSLicenseNotification();
  });

  useEffect(() => {
    if (isSuccess) {
      getDevices({
        search: '',
        sortBy: '',
      });
    }
  }, [isSuccess]);

  interface RenderCardProps {
    title: string;
    content: React.ReactNode;
  }

  const isOMSExpired = () => {
    const expiryDate = dayjs.utc(oms.expiryDate);
    const dateNow = dayjs();
    const comparedFormat = 'YYYY-MM-DD HH:mm:ss';
    return dayjs(expiryDate.format(comparedFormat)).isBefore(dayjs(dateNow.format(comparedFormat)));
  };

  const RenderCard: React.FC<RenderCardProps> = ({ title, content }) => (
    <Grid.Col className={classes.grid} xs={12} sm={3}>
      <Flex style={{ height: rem(86) }} p="md" direction="column" justify="space-between">
        <Text>{title}</Text>
        <Text size={24}>{content}</Text>
      </Flex>
    </Grid.Col>
  );

  const renderPeriod = (startAt: string, expiredAt: string, isActive: boolean) => (
    <RenderCard
      title={t('Period')}
      content={
        startAt && expiredAt && isActive
          ? `${formatToDate(startAt, dateFormat)} ~ ${formatToDate(expiredAt, dateFormat)}`
          : '- -'
      }
    />
  );

  const renderStorage = (storageLimit: string) => (
    <RenderCard
      title={t('Storage/Organization')}
      content={storageLimit !== '-1' ? `${bitsToGigabytes(BigInt(storageLimit))}GB` : '- -'}
    />
  );

  const renderUsers = (userLimit: number, userCount: number) => (
    <RenderCard
      title={t('Users')}
      content={
        userLimit === -1 ? (
          '- -'
        ) : userLimit >= userCount ? (
          `${userCount}/${userLimit}`
        ) : (
          <>
            <span style={{ color: '#E4002B' }}>{userCount}</span>/{userLimit}
          </>
        )
      }
    />
  );

  const renderDevices = (deviceCount: number, deviceLimit: number) => (
    <RenderCard
      title={t('Devices')}
      content={
        deviceLimit === -1 ? (
          '- -'
        ) : deviceLimit >= deviceCount ? (
          `${deviceCount}/${deviceLimit}`
        ) : (
          <>
            <span style={{ color: '#E4002B' }}>{deviceCount}</span>/{deviceLimit}
          </>
        )
      }
    />
  );

  const checkNotificationVisibility = () => {
    const expiryDate = dayjs.utc(oms.expiryDate);
    const dateNow = dayjs().utc();
    //if license is expired, no need to show notification
    if (isOMSExpired()) {
      return;
    }
    const isOldUser = dayjs.utc(organization.createdAt).isBefore(cutoffDate);
    const oldUserThresholds = [89, 59, 29, 14, 1, 0];
    const newUserThresholds = [29, 14, 1, 0];
    const lastCloseTime = oamExpireNotifyCloseTime ? dayjs.utc(oamExpireNotifyCloseTime) : null;

    const checkThresholds = (thresholds: number[]) => {
      for (const threshold of thresholds) {
        const notificationDate = expiryDate.subtract(threshold, 'day');
        const isAfterNotificationDate = dateNow.isAfter(notificationDate);
        const hasNeverClosed = !lastCloseTime;
        const hasClosedBeforeNotification = lastCloseTime?.isBefore(notificationDate);

        if (isAfterNotificationDate && (hasNeverClosed || hasClosedBeforeNotification)) {
          return true;
        }
      }
      return false;
    };

    const notificationShown = isOldUser
      ? checkThresholds(oldUserThresholds)
      : checkThresholds(newUserThresholds);

    setNotificationVisible(notificationShown);
  };

  useEffect(() => {
    checkNotificationVisibility();
  }, [oamExpireNotifyCloseTime, oms.expiryDate, organization.createdAt]);

  const handleCloseNotification = async () => {
    await upsertNotificationFlag({
      key: 'oamExpireNotifyCloseTime',
    });
  };

  const renderNotification = () =>
    isNotificationVisible && (
      <Notification
        icon={<IconExclamationMark />}
        onClose={handleCloseNotification}
        styles={() => ({
          root: {
            overflow: 'visible',
            borderLeft: '8px solid #F2A900',
            backgroundColor: '#444444',
            height: rem(50),
            marginBottom: rem(16),
            [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)})`]: {
              height: rem(115),
            },
          },
          icon: {
            background: '#F2A900',
            width: '20px',
            height: '20px',
            marginRight: '8px',
            [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)})`]: {
              display: 'none',
            },
          },
          description: {
            color: '#FFFFFF',
            fontSize: rem(16),
          },
          closeButton: {
            color: '#FFFFFF',
            borderRadius: '50%',
            '&:hover': {
              background: '#131313 !important',
            },
            [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)})`]: {
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
          },
        })}
      >
        <Text>OMS {willExpireTitleText}</Text>
        <Text>{willExpireDescText}</Text>
      </Notification>
    );

  return (
    <Container fluid px="lg" pb={60}>
      <Text className={classes.title}>{t('Dashboard')}</Text>
      {ossStatus.isUninitialized ||
      devicesStatus.isUninitialized ||
      devicesStatus.isLoading ||
      getOrganizationUserCountStatus.isLoading ? (
        <LoadingOverlay
          overlayBlur={2}
          zIndex={1}
          loader={CustomLoader({ loadingText: t('Loading') })}
          visible
        />
      ) : (
        <>
          {renderNotification()}
          <Stack spacing="lg">
            <Card padding={0} sx={{ border: '1px solid #CCC' }}>
              <Card.Section withBorder px="md" py="sm" bg="#F2F2F2">
                <Text>{`OMS ${!oms.isActive ? 'no subscriptions' : oms.planDesc}`}</Text>
              </Card.Section>
              <MediaQuery
                query={`(max-width: ${em(
                  getBreakpointValue(theme.breakpoints.sm) - 1,
                )}) and (min-width: 20em)`}
                styles={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Grid gutter={0}>
                  {renderPeriod(oms.startDate, oms.expiryDate, oms.isActive)}
                  {renderUsers(oms.userLimit, omsUsersCount)}
                  {renderDevices(totalCount, oms.deviceLimit)}
                  {renderStorage(oms.storage.limit)}
                </Grid>
              </MediaQuery>
            </Card>

            <Card padding={0} sx={{ border: '1px solid #CCC' }} mb={60}>
              <Card.Section withBorder px="md" py="sm" bg="#F2F2F2">
                <Text>{`OSS ${oss.planDesc}`}</Text>
              </Card.Section>
              <MediaQuery
                query={`(max-width: ${em(
                  getBreakpointValue(theme.breakpoints.sm) - 1,
                )}) and (min-width: 20em)`}
                styles={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Grid gutter={0}>
                  {renderPeriod(oss.startDate, oss.expiryDate, true)}
                  <RenderCard title={t('License')} content={oss.attendeeCount} />
                  <RenderCard title={t('Credit/User')} content={oss.credit.toString()} />
                  <RenderCard
                    title={t('Storage/User')}
                    content={`${bitsToGigabytes(BigInt(oss.storageLimit))}GB`}
                  />
                </Grid>
              </MediaQuery>
            </Card>
          </Stack>
        </>
      )}
    </Container>
  );
}

export default Dashboard;

Dashboard.requireAuth = true;
