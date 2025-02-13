import { useCallback, useEffect } from 'react';
import { AppShell, createStyles, Flex, rem, Text, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import HeaderBar, { IconTheme } from '../../components/headerBar';
import LanguageMenu from '../../components/headerBar/language';
import { useResendRegisterMutation } from '../../store/services';
import { usePopup } from '../../providers/popupProvider';
import OAMButton from '../../components/base/Button';

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

function AccountNotVerified() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const router = useRouter();
  const { query } = router;
  const { message } = usePopup();
  const [resendRegister] = useResendRegisterMutation();

  useEffect(() => {
    if (!router.query.email) router.replace({ pathname: '/', query });
  });

  const onBackToLogin = () => {
    router.replace({ pathname: '/auth/signIn' }).catch((err) => console.error(err));
  };

  const onResend = useCallback(() => {
    if (query.email) {
      resendRegister({ email: query.email as string })
        .unwrap()
        .then((res) => {
          if (res) {
            message.open({
              tit: t(''),
              msg: t('Verification_letter_resend_successfully'),
              rightBtn: t('Ok'),
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [query]);

  console.log(query.apple);
  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      <Flex
        mih="100%"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        className={classes.container}
      >
        <Text className={classes.title}>{t('Account_not_verified')}</Text>
        <Text mb={3} maw={500}>
          {t('Account_not_verified_content', {
            email: query.appleId ? '' : ` (${query.email as string})`,
          })}
        </Text>
        <Text mb={3} maw={500}>
          {t('Check_spam_folder')}
        </Text>
        <Flex w="100%" justify="center" align="center" direction="row">
          <Text mr={rem(5)} mt={rem(20)} mb={rem(20)}>
            {t('Still_cannot_see_the_email')}
            <UnstyledButton onClick={onResend} ml={rem(5)}>
              <Text fz={14} td="underline">
                {t('Resend')}
              </Text>
            </UnstyledButton>
          </Text>
        </Flex>
        <OAMButton onClick={onBackToLogin}>{t('Back_to_login')}</OAMButton>
      </Flex>
    </AppShell>
  );
}

export default AccountNotVerified;
