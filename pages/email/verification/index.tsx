import { AppShell, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog, { OAMDialogType } from '../../../components/dialog';
import HeaderBar, { IconTheme } from '../../../components/headerBar';
import LanguageMenu from '../../../components/headerBar/language';
import { usePopup } from '../../../providers/popupProvider';
import {
  ConfirmResponse,
  useCheckEmailTokenQuery,
  useConfirmRegisterMutation,
  useResendRegisterMutation,
} from '../../../store/services';
import { CustomLoader } from '../../../components/customLoader';

export enum SOLUTION_ENUM {
  // cb
  CB = 'CB',
  CB_INVITE = 'CB_INV',
  // cc
  CC = 'CC',
  CC_INVITE = 'CC_INV',
  // oms
  OMSC = 'OMSC',
  OMSC_INVITE = 'OMSC_INV',
  OMSL = 'OMSL',
  OMSL_INVITE = 'OMSL_INV',
  // oam/am
  OAM = 'OAM',
  OAM_INVITE = 'OAM_INV',
  OAM_TEMP = 'OAM_TEMP',
  AM = 'AM',
  AM_INVITE = 'AM_INV',
}

const { CB, CC, OMSC, OMSL, OAM, AM } = SOLUTION_ENUM;

const Verification = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = router.query;
  const { message } = usePopup();
  const [openedPopup, { open, close }] = useDisclosure(false);
  const checkTokenResult = useCheckEmailTokenQuery({
    token: token as string,
  }); //TODO: isSuccess may not be a standard property for a query result.
  const { isError, isSuccess, data, error } = checkTokenResult;
  const [confirmRegister, confirmRegisterStatus] = useConfirmRegisterMutation();
  const [resendRegister] = useResendRegisterMutation();
  const [verificationState, setVerificationState] = useState<ConfirmResponse['data']>();

  const onBackToLogin = useCallback(() => {
    const { type, state } = verificationState || {};
    router.replace({
      pathname: '/auth/signIn',
      query: { ...router.query, type, state },
    });
  }, [verificationState]);

  const onResend = useCallback(() => {
    const formData = {
      email: checkTokenResult.data?.data.email!,
    };
    resendRegister(formData)
      .unwrap()
      .then((res) => {
        if (res) {
          message.open({
            tit: t(''),
            msg: t('Verification_letter_resend_successfully'),
            rightBtn: t('Ok'),
            rightBtnClick: onBackToLogin,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [checkTokenResult.data]);

  async function confirm() {
    await confirmRegister({ token: token as string })
      .unwrap()
      .then(({ data }: ConfirmResponse) => {
        // const { data } = {
        //   data: { solution: 'CB', hasBackToLogin: true, type: 'tryType', state: 'testState' },
        //   version: 'dev-v1.1.0',
        // } as ConfirmResponse;
        setVerificationState(data);
        open();
      })
      .catch((err: any) => {
        if (err.status === 410) {
          message.open({
            tit: t('Verification_link_expired'),
            msg: `${t('Verification_link_expired_content')}
            ${t('Resend_to')} (${checkTokenResult.data?.data.email})?`,
            rightBtn: t('Resend'),
            rightBtnClick: onResend,
          });
        } else {
          onBackToLogin();
          // message.open({
          //   tit: t('Error'),
          //   msg: err?.data?.message || t('Unknown_error'),
          //   rightBtn: t('Back_to_login'),
          // });
        }
      });
  }

  useEffect(() => {
    if (checkTokenResult.isSuccess && confirmRegisterStatus.isUninitialized) confirm();
  }, [checkTokenResult]);

  // TODO i18n
  const MessageMap = {
    [CB]: 'Please_login_again',
    [CC]: 'Please_login_from_apps',
    [OMSC]: 'Please_login_from_your_windows_app_or_login_here_to_OMS_website',
    [OMSL]: 'Please_login_from_your_windows_app_or_login_here_to_OMS_website',
    [OAM]: 'Please_login_again',
  };
  function verifiedMessage() {
    return verificationState?.solution && verificationState.solution in MessageMap
      ? t(MessageMap[verificationState.solution as keyof typeof MessageMap])
      : null;
  }

  if (isError) {
    onBackToLogin();
  }

  if (isSuccess) {
    if (data.data.isExpired) {
      message.open({
        tit: t('Verification_link_expired'),
        msg: `${t('Verification_link_expired_content')}
        ${t('Resend_to')} (${checkTokenResult.data?.data.email})?`,
        rightBtn: t('Resend'),
        rightBtnClick: onResend,
      });

      return <></>;
    }
  }

  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      {(checkTokenResult.isFetching || confirmRegisterStatus.isLoading) && (
        <LoadingOverlay
          overlayBlur={2}
          loader={CustomLoader({ loadingText: t('Loading') })}
          visible
        />
      )}
      <Dialog
        customType={verificationState?.hasBackToLogin ? OAMDialogType.MESSAGE : OAMDialogType.NONE}
        opened={openedPopup}
        onClose={close}
        title={t('Account_verified')}
        message={t(verifiedMessage() as string)}
        rightButton={t('Back_to_login')}
        onRightClick={() => {
          onBackToLogin();
        }}
      />
    </AppShell>
  );
};

export default Verification;
