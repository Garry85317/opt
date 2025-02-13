import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { AppShell, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'usehooks-ts';
import HeaderBar, { IconTheme } from '../../components/headerBar';
import LanguageMenu from '../../components/headerBar/language';
import { usePopup } from '../../providers/popupProvider';
import { useResetPasswordMutation } from '../../store/services';

// from forgotPassword -> email -> changePassword
const ChangePassword = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = router.query;
  const { resetPassword: resetPasswordPopup, message } = usePopup();
  const [resetPassword] = useResetPasswordMutation();

  const onBackToLogin = () => {
    const { token, ...query } = router.query;
    router.replace({ pathname: '/auth/signIn', query }).catch((err) => console.error(err));
  };

  const onResult = useCallback(async (password: string) => {
    if (!token) return;

    await resetPassword({ password, token: token as string })
      .unwrap()
      .then(() => {
        message.open({
          tit: t('Password_updated'),
          msg: t('You_can_login_with_new_password_now'),
          rightBtn: t('Back_to_login'),
          rightBtnClick: onBackToLogin,
        });
      })
      .catch(onBackToLogin);
  }, []);

  useEffectOnce(() => {
    if (token && typeof token === 'string') {
      resetPasswordPopup.open({ result: onResult, cancel: onBackToLogin });
    } else {
      onBackToLogin();
    }
  });

  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      <Box />
    </AppShell>
  );
};

export default ChangePassword;
