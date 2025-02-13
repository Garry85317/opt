import { AppShell, LoadingOverlay, em, useMantineTheme, getBreakpointValue } from '@mantine/core';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useEventListener } from 'usehooks-ts';
import defer from 'lodash/defer';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from '../store';
import useCheckAuth from '../hooks/useCheckAuth';
import { useJWTContext } from '../providers/jwtProvider';
import { setAuthInfo, clearAuthInfo } from '../store/actions';
import {
  useLazyGetUserQuery,
  useLazyRedirectQuery,
  useLazySessionQuery,
  useLazyOmsInfoQuery,
  useLazyGetNotificationFlagQuery,
  useUpsertNotificationFlagMutation,
  useLazyGetOMSTrialExtensionNotificationFlagQuery,
  useUpdateOMSTrialExtensionNotificationFlagMutation,
} from '../store/services';
import {
  selectAccountId,
  selectHasRedirect,
  selectLicense,
  selectLicenseNotification,
  selecOMSTrialExtensionNotification,
} from '../store/slices';
import { Role } from '../utils/role';
import GuardianBanner from './GuardianBanner';
import { PremiumCard } from './base/PremiumCard';
import HeaderBar, { IconTheme } from './headerBar';
import NotificationsMenu from './headerBar/notifications';
import ServiceMenu from './headerBar/service';
import LanguageMenu from './headerBar/language';
import Account from './headerBar/account';
import NavigationBar from './navbar';
import NavigationFooter from './navFooter';
import { API_UNAUTHORIZED_EVENT } from '../utils/events';
import { usePopup } from '../providers/popupProvider';
import { CustomLoader } from './customLoader';
import { formatToDate } from '../utils/date';

type QueryResult = {
  status: QueryStatus;
  isSuccess: boolean;
  isError: boolean;
};

const isQueryResultSuccess = (query: QueryResult) =>
  query.status === QueryStatus.fulfilled && query.isSuccess;
const isQueryResultError = (query: QueryResult) =>
  query.status === QueryStatus.rejected && query.isError;
const wholePageRouteList = ['/account'];
const showUnloginHeaderList = ['/newAgreement'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { query, pathname } = router;
  const { token, exchangeTokenStatus } = useCheckAuth();
  const [redirect, redirectStatus] = useLazyRedirectQuery();
  const [session, sessionStatus] = useLazySessionQuery();
  const [getUser, getUserStatus] = useLazyGetUserQuery();
  const { oamRole, isInitialProfile } = useJWTContext();
  const accountId = useSelector(selectAccountId);
  const hasRedirect = useSelector(selectHasRedirect);
  const [getOmsInfo, getOmsInfoStatus] = useLazyOmsInfoQuery();
  const [getNotificationFlag, getNotificationFlagStatus] = useLazyGetNotificationFlagQuery();
  const [upsertNotificationFlag] = useUpsertNotificationFlagMutation();
  const [getOMSTrialExtensionNotificationFlag, getOMSTrialExtensionNotificationFlagStatus] =
    useLazyGetOMSTrialExtensionNotificationFlagQuery();
  const [updateOMSTrialExtensionNotificationFlag] =
    useUpdateOMSTrialExtensionNotificationFlagMutation();
  const { oms } = useSelector(selectLicense);
  const { isOAMExpired } = useSelector(selectLicenseNotification);
  const { showOmsTrialExtensionDialog, descText, agreeOptionText, disagreeOptionText } =
    useSelector(selecOMSTrialExtensionNotification);
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const [isWholePage, setIsWholePage] = useState(false);
  const [isShowUnloginHeader, setIsShowUnloginHeader] = useState(false);
  const { message } = usePopup();
  const dateFormat = useSelector((state) => state.account.formatDate) as string;
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  useEffect(() => {
    if (wholePageRouteList.includes(pathname)) {
      setIsWholePage(true);
    } else {
      setIsWholePage(false);
    }

    if (showUnloginHeaderList.includes(pathname)) {
      setIsShowUnloginHeader(true);
    } else {
      setIsShowUnloginHeader(false);
    }
  }, [router]);

  const popupControl = usePopup();
  const [keepsUI, setKeepsUI] = useState(false);
  const docRef = useRef(document);

  useEffect(() => {
    if (token) {
      if (query.type) {
        redirect({
          type: query.type as string,
          state: query.state as string,
        }).unwrap();
        session();
      } else {
        getUser();
      }

      getOmsInfo();
      getNotificationFlag();
      getOMSTrialExtensionNotificationFlag();
    }
  }, [token]);

  useEffect(() => {
    if (oamRole && isInitialProfile === false && router.pathname !== '/auth/signIn') {
      let meta: any = {};
      if (query.qrcode) {
        meta = {
          qrcode: query.qrcode,
        };
      }
      router.push({
        pathname: '/auth/signUpThirdParty',
        query: { meta: JSON.stringify(meta) },
      });
      return;
    }
    if (oamRole === Role.OAM_ROLE_USER) {
      router.replace({ pathname: '/account', query: router.query });
    }
  }, [oamRole, isInitialProfile]);

  useEffect(() => {
    if (isQueryResultError(redirectStatus)) {
      const { type, ...param } = query;
      router.push({ pathname: '/', query: param });
    }

    if (isQueryResultSuccess(redirectStatus) && isQueryResultSuccess(sessionStatus)) {
      try {
        const whitelistString = process.env.NEXT_PUBLIC_NEW_AGREEMENT_WHITELIST;
        const url = new URL(redirectStatus.data!.data.redirectTo);

        if (!whitelistString) {
          router.push(url.href);
        }

        const whitelistArray = whitelistString?.split(',');
        const isRedirectToNewAgreement =
          oamRole === Role.OAM_ROLE_OWNER &&
          sessionStatus.data!.data.organization.latestInfoDto?.hasAgreedToTerms !== true &&
          router.query.isnineentrance !== 'true'; //Mantis#20095 trigger by nine entrance

        if (
          whitelistArray?.some(
            (x) => x.toLowerCase() === redirectStatus.originalArgs?.type.toLowerCase(),
          ) &&
          isRedirectToNewAgreement
        ) {
          // Remark for new agreement by Howard
          router.push(
            {
              pathname: '/newAgreement',
              query: { redirectTo: redirectStatus.data!.data.redirectTo },
            },
            '/newAgreement',
          );
        } else {
          //Solution redirect after login, remark by Howard
          router.push(url.href);
        }
      } catch (err) {
        router.push({ pathname: '/' });
      }
    }
  }, [redirectStatus, sessionStatus]);

  const handleUpsertNotificationFlag = async (flagKey: string) => {
    await upsertNotificationFlag({ key: flagKey });
  };

  const handleUpdateOMSTrialExtensionNotificationFlag = async (userResponse: boolean) => {
    await updateOMSTrialExtensionNotificationFlag({ isAgreed: userResponse });
  };

  // Show OMS license expired dialog when:
  // - License expired (Compare current date with license expiry date)
  // - user hasn't been notified
  // - Not in URL redirect flow
  useEffect(() => {
    if (!getNotificationFlagStatus.isSuccess || !router.isReady) {
      return;
    }
    const expiryDate = dayjs.utc(oms.expiryDate).format('YYYY-MM-DD HH:mm:ss');
    const dateNow = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const isAdmin = oamRole === Role.OAM_ROLE_OWNER || oamRole === Role.OAM_ROLE_ADMIN;

    const msgContent = t(isAdmin ? 'Oms_license_expired_content' : 'Oms_license_expired_content2', {
      plan: oms.planDesc,
      expiredDate: formatToDate(oms.expiryDate, dateFormat),
    });

    if (dayjs(expiryDate).isBefore(dayjs(dateNow)) && !isOAMExpired && !query?.type) {
      message.open({
        tit: t('Oms_license_expired_title', { plan: oms.planDesc }),
        msg: msgContent,
        rightBtn: t('Ok'),
        rightBtnClick: async () => {
          await handleUpsertNotificationFlag('isOAMExpired');
        },
      });
    }
  }, [getOmsInfoStatus, getNotificationFlagStatus.isSuccess, router.isReady]);

  // Formats a message by making the dates within curly braces bold.
  const formatMessage = (message: string) => {
    const parts = message.split(/(\{.*?\})/g);
    return parts.map((part, index) => {
      if (part.match(/\{.*?\}/)) {
        const date = part.slice(1, -1); // remove curly braces
        return <strong key={index}>{date}</strong>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  // Show OMS trial extension dialog when:
  // - User hasn't responded the dialog yet
  // - Not in URL redirect flow
  useEffect(() => {
    if (!getOMSTrialExtensionNotificationFlagStatus.isSuccess || !router.isReady) {
      return;
    }

    if (showOmsTrialExtensionDialog && !query?.type) {
      const formatDescText = formatMessage(descText);

      message.open({
        msg: <>{formatDescText}</>,
        leftBtn: disagreeOptionText,
        rightBtn: agreeOptionText,
        leftBtnClick: async () => {
          await handleUpdateOMSTrialExtensionNotificationFlag(false);
        },
        rightBtnClick: async () => {
          await handleUpdateOMSTrialExtensionNotificationFlag(true);
          getOmsInfo();
        },
      });
    }
  }, [
    getOMSTrialExtensionNotificationFlagStatus.isSuccess,
    router.isReady,
    showOmsTrialExtensionDialog,
  ]);

  const onAPIUnauthorized = useCallback(() => {
    if (query.type) {
      dispatch(clearAuthInfo());
      return;
    }
    setKeepsUI(true);
    // defer to make sure the popup is last shown
    defer(() => {
      Object.values(popupControl).forEach((popup) => popup.close());
      popupControl.message.open({
        tit: t('Access_expired'),
        msg: t('Access_expired_content'),
        rightBtn: t('Ok'),
        rightBtnClick: () => {
          setKeepsUI(false);
          dispatch(clearAuthInfo());
        },
      });
    });
  }, [popupControl, t]);

  useEventListener(API_UNAUTHORIZED_EVENT, onAPIUnauthorized, docRef);

  if (
    keepsUI ||
    (token &&
      getUserStatus.isSuccess &&
      redirectStatus.isUninitialized &&
      getOmsInfoStatus.isSuccess &&
      getNotificationFlagStatus.isSuccess)
  ) {
    if (hasRedirect) {
      dispatch(setAuthInfo({ accountId, token }));
    }

    return (
      <AppShell
        padding={0}
        header={
          isShowUnloginHeader ? (
            <HeaderBar backgroundColor="#FFFFFF" isShowGoback={isWholePage} titleColor="#01256B">
              <LanguageMenu theme={IconTheme.LIGHT} />
            </HeaderBar>
          ) : (
            <HeaderBar backgroundColor="#01256B" isShowGoback={isWholePage} titleColor="#FFFFFF">
              <NotificationsMenu />
              <ServiceMenu />
              <LanguageMenu
                openByDefault={false}
                isOpened={isLanguageMenuOpen}
                onLanguageMenuStateChange={setIsLanguageMenuOpen}
              />
              <Account onLanguageMenuStateChange={setIsLanguageMenuOpen} />
            </HeaderBar>
          )
        }
        navbar={isMobile ? <></> : <NavigationBar isShow={!isWholePage && !isShowUnloginHeader} />}
        footer={
          isMobile ? <NavigationFooter isShow={!isWholePage && !isShowUnloginHeader} /> : <></>
        }
      >
        {children}
        <PremiumCard title={"You're Advanced trial now"} />
        <GuardianBanner />
      </AppShell>
    );
  }

  return (
    <LoadingOverlay
      overlayBlur={2}
      zIndex={1}
      loader={CustomLoader({ loadingText: t('Loading') })}
      visible
    />
  );
}
