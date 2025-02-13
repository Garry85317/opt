import { AppShell, Box, Flex, Text, createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import HeaderBar, { IconTheme } from '../../components/headerBar';
import LanguageMenu from '../../components/headerBar/language';
import { usePopup } from '../../providers/popupProvider';
// import { CODE_VERIFY_CODE_ERROR } from '../../utils/constant';
import {
  useCheckEmailTokenQuery,
  useOrganizationsUsersPasswordMutation,
  useSendOrganizationUserInvitationMutation,
} from '../../store/services';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    marginBottom: theme.spacing.xl,
  },
  text: {
    fontSize: theme.fontSizes.xs,
    marginBottom: theme.spacing.xl,
  },
}));

const Invitation = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = router.query;
  const checkTokenResult = useCheckEmailTokenQuery(
    { token: token as string },
    { refetchOnFocus: true },
  );
  const { isError, isSuccess, data, error } = checkTokenResult;
  const { invitationPassword, message } = usePopup();
  const [organizationsUsersPassword] = useOrganizationsUsersPasswordMutation();
  const [invitation] = useSendOrganizationUserInvitationMutation();
  const onBackToLogin = () => {
    const { token, ...query } = router.query;
    router.replace({ pathname: '/auth/signIn', query }).catch((err) => console.error(err));
  };

  const onSetPassword = useCallback(
    async (password: string, email: string) => {
      try {
        const response = await organizationsUsersPassword({
          token: token as string,
          newPassword: password,
        })
          .unwrap()
          .then(() => {
            message.open({
              tit: t('Account_activated'),
              msg: t('Please_login_again'),
              rightBtn: t('Back_to_login'),
              rightBtnClick: onBackToLogin,
            });
          });
      } catch (err) {
        onBackToLogin();
      }
    },
    [token],
  );

  useEffect(() => {
    if (!router.isReady) return;
    if (isSuccess) {
      const { email, isExpired } = data.data;
      if (email && !isExpired) {
        invitationPassword.open({
          email,
          result: (password) => {
            onSetPassword(password, email);
          },
        });
      }
    }
  }, [router.isReady, isSuccess]);

  const expiredMessage =
    (error as FetchBaseQueryError)?.status === 404 || data?.data.isExpired ? (
      <>
        <Box />
        <Flex
          mih="100%"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          className={classes.container}
        >
          <Text className={classes.title}>{t('Activation_link_expired')}</Text>
          <Text mb={3} maw={500}>
            {t('Activation_link_expired_content')}
          </Text>
        </Flex>
      </>
    ) : (
      <Box />
    );

  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      {expiredMessage}
    </AppShell>
  );
};

export default Invitation;
