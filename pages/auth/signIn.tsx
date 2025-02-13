import {
  AppShell,
  Button,
  Divider,
  Flex,
  Image,
  Text,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core';
import type { FlexProps } from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from '../../store';
import AuthGuard from '../../components/AuthGuard';
import OAMButton, { OAMButtonType } from '../../components/base/Button';
import TextInput from '../../components/base/TextInput';
import HeaderBar, { IconTheme } from '../../components/headerBar';
import LanguageMenu from '../../components/headerBar/language';
import Welcome from '../../components/welcome';
import useEmailQuery from '../../hooks/useEmailQuery';
import { useJWTContext } from '../../providers/jwtProvider';
import { usePopup } from '../../providers/popupProvider';
import {
  useLoginMutation,
  useQrcodeLoginMutation,
  useResendRegisterMutation,
} from '../../store/services';
import { selectAccessToken } from '../../store/slices';
import { appleIconBase64, googleIconBase64, microsoftIconBase64 } from '../../utils/base64Image';
import toI18nKey from '../../i18n/extraI18nKeys';
import useCriticalLoadingAction from '../../hooks/useCriticalLoadingAction';
import Anchor, { darkBlueColor } from '../../components/base/Anchor';
import Contactus from '../../components/ContactUs';

const POLICY_LINK_MAP = {
  Agree_terms: '/termsConditions',
  Agree_privacy_policy: '/privacy',
  Agree_cookie_policy: '/cookiesPolicy',
};

function PolicyLinks(props: FlexProps & React.ComponentPropsWithoutRef<'div'>) {
  const { t } = useTranslation();
  return (
    <Flex
      direction="row"
      wrap="wrap"
      justify="center"
      style={{ whiteSpace: 'pre-wrap' }}
      {...props}
    >
      {Object.entries(POLICY_LINK_MAP).map(([item, link], index) => (
        <Fragment key={item}>
          <Anchor href={link} target="_blank">
            <Text td="underline" size={rem(12)}>
              {t(item)}
            </Text>
          </Anchor>
          {index !== Object.keys(POLICY_LINK_MAP).length - 1 && (
            <Text size={rem(12)} color={darkBlueColor}>
              {' | '}
            </Text>
          )}
        </Fragment>
      ))}
    </Flex>
  );
}

const useStyles = createStyles((theme) => ({
  paper: {
    width: '44%',
    [theme.fn.smallerThan('1024')]: {
      width: '100%',
    },
    [theme.fn.smallerThan('768')]: {
      width: '100%',
      padding: rem(0),
      background: 'white',
      height: '100%',
    },
  },
  form: {
    width: `max(55%, ${rem(400)})`,
    background: '#FFFFFF',
    borderRadius: '4px',
    padding: rem(40),
    margin: 'auto',
    [theme.fn.smallerThan('1024')]: {
      width: `${rem(400)}`,
    },
    [theme.fn.smallerThan('768')]: {
      width: '100%',
      height: 'inherit',
      padding: '20px',
      borderRadius: '0',
      margin: `0 0 ${rem(30)} 0`,
      position: 'relative',
    },
    '& .mantine-Divider-root': {
      marginTop: 0,
    },
  },
  carouselGroup: {
    backgroundColor: '#415284',
    width: '56%',
    height: '100%',
    position: 'relative',
    [theme.fn.smallerThan('1024')]: {
      display: 'none',
    },
  },
  group: {
    height: '100%',
    padding: `${rem(80)} ${rem(60)} ${rem(40)} ${rem(60)}`,
  },
  flex: {
    background: '#F2F2F2',
    [theme.fn.smallerThan('1024')]: {
      background: '#415284',
    },
    [theme.fn.smallerThan('768')]: {
      backgroundColor: 'white',
    },
  },
  unstyleText: {
    fontSize: '14px',
    color: '#465EE3',
    textDecoration: 'underline',
  },
  socialButton: {
    radius: 'md',
    marginBottom: rem(12),
    width: '100%',
    color: 'black',
    fontWeight: 400,
    variant: 'outline',
    borderColor: '#CCCCCC',
    background: 'white',
    display: 'flex',
    ':not([data-disabled]):hover': {
      background:
        'linear-gradient(0deg, rgba(147, 169, 201, 0.20) 0%, rgba(147, 169, 201, 0.20) 100%), #FFF',
    },
    ':not([data-disabled]):focus': {
      background:
        'linear-gradient(0deg, rgba(147, 169, 201, 0.40) 0%, rgba(147, 169, 201, 0.40) 100%), #FFF',
    },
  },
  signInHint: {
    color: 'black',
    fontSize: '14px',
  },
}));

function SignInPage() {
  const router = useRouter();
  const { '3rd': third, email, type, state } = router.query;
  const { classes } = useStyles();
  const { t } = useTranslation();
  const { accountId } = useJWTContext();
  const { message } = usePopup();
  const [qrcodeLogin] = useQrcodeLoginMutation();
  const [googleSSOUrl] = useState<URL>(new URL(`${process.env.NEXT_PUBLIC_GOOGLE_SSO_URL}`));
  const [microsoftSSOUrl] = useState<URL>(new URL(`${process.env.NEXT_PUBLIC_MICROSOFT_SSO_URL}`));
  const [appleSSOUrl] = useState<URL>(new URL(`${process.env.NEXT_PUBLIC_APPLE_SSO_URL}`));
  const [login] = useLoginMutation();
  const [resendRegister] = useResendRegisterMutation();
  const token = useSelector(selectAccessToken);
  const { enterLoading, leaveLoading } = useCriticalLoadingAction();

  googleSSOUrl.searchParams.set('type', type as string);
  googleSSOUrl.searchParams.set('state', state as string);
  microsoftSSOUrl.searchParams.set('type', type as string);
  microsoftSSOUrl.searchParams.set('state', state as string);
  appleSSOUrl.searchParams.set('type', type as string);
  appleSSOUrl.searchParams.set('state', state as string);
  if (router.query.qrcode) {
    googleSSOUrl.searchParams.set(
      'state',
      JSON.stringify({
        state,
        qrcode: router.query.qrcode,
      }),
    );
    microsoftSSOUrl.searchParams.set(
      'state',
      JSON.stringify({
        state,
        qrcode: router.query.qrcode,
      }),
    );
    appleSSOUrl.searchParams.set(
      'state',
      JSON.stringify({
        state,
        qrcode: router.query.qrcode,
      }),
    );
  }
  if (router.query.deleteAccount === 'true') {
    const deleteAccountString = JSON.stringify({ deleteAccount: true });
    googleSSOUrl.searchParams.set('state', deleteAccountString);
    microsoftSSOUrl.searchParams.set('state', deleteAccountString);
    appleSSOUrl.searchParams.set('state', deleteAccountString);
  }
  const isInvalidEmail = isEmail(t('Invalid_email'));
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: isInvalidEmail,
      password: isNotEmpty(t('Password_do_not_empty')),
    },
    validateInputOnBlur: ['email', 'password'],
  });

  const onResend = useCallback(() => {
    const formData = {
      email: form.values.email,
    };
    resendRegister(formData)
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
  }, [form]);

  const signIn = async () => {
    const signInFrom = `${type}` || '';
    const signInState = `${state}` || '';
    const formData = {
      email: form.values.email,
      password: form.values.password,
      type: signInFrom === null ? '' : signInFrom,
      state: signInState === null ? '' : signInState,
    };

    try {
      enterLoading();

      if (router.query.qrcode) {
        await qrcodeLogin({
          email: form.values.email,
          password: form.values.password,
          qrcode: router.query.qrcode as string,
        }).unwrap();
      } else {
        const { data: loginData } = await login(formData).unwrap();
        if (router.query?.deleteAccount) {
          router.replace({ pathname: '/account', query: router.query });
        }
        // Check if URL contains any query parameters
        const hasQuery = Object.keys(router.query).length > 0;
        /**
         * Redirect logic:
         * 1. Without query params -> Redirect to dashboard and reload for zendesk initialization
         * 2. If has query params: Return to the original solution website based on 'type'
         */
        if (!hasQuery) {
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      const { status } = err as { status: number };
      if (status === 403) {
        router.push({ pathname: '/auth/accountNotVerified', query: { email: form.values.email } });
      } else {
        // ex: 400 500
        console.log(err);
        const errorMessage = (err as { status: number; data?: { message?: string } })?.data
          ?.message;
        message.open({
          tit: t('Error'),
          msg: t(toI18nKey(errorMessage) || 'Unknown_error'),
          rightBtn: t('Close'),
        });
      }

      leaveLoading();
    }
  };
  const onSignIn = useCallback(signIn, [form]);

  const onForgotPassword = useCallback(() => {
    router.push({ pathname: '/auth/forgotPassword', query: router.query });
  }, []);

  const onBackToLogin = () => {
    router.replace({ pathname: '/auth/signIn', query: router.query });
  };

  const onSignUp = useCallback(() => {
    if (router.isReady) {
      const fromStatus = router.query.status;
      router
        .push({
          pathname: '/auth/signUp',
          query: {
            type,
            state,
            ...(fromStatus ? { status: fromStatus } : {}),
          },
        })
        .catch((err) => console.error(err));
    }
  }, [router.isReady]);

  const RegisterGuidePopUp = () => {
    message.open({
      tit: t('Register'),
      msg: t('To_create_an_admin_account_of_Optoma_account_platform'),
      rightBtn: t('Create_admin'),
      rightBtnClick: onSignUp,
      leftBtn: t('Cancel'),
      leftBtnClick: onBackToLogin,
    });
  };

  useEmailQuery(form);

  const renderForm = ({ third, email }: { third?: string; email?: string }) => {
    const google = third?.toString().toLowerCase() === 'google';
    const googleOnly = third?.toString().toLowerCase() === 'googleonly';

    const loginInputs = (
      <>
        <Text
          color="#415284"
          mb={rem(!isInvalidEmail(email) ? 14 : 24)}
          align="left"
          w="100%"
          fz={18}
          fw={500}
        >
          {t('Sign_in')}
        </Text>
        {!isInvalidEmail(email) && (
          <Text mb={rem(24)} align="left" w="100%" className={classes.signInHint}>
            {t('Sign_in_with_invited_email')}
          </Text>
        )}
        <TextInput
          mb={rem(4)}
          w="100%"
          required
          placeholder={t('Email').toString()}
          radius="md"
          type="email"
          autoComplete="username"
          // onBlurCapture={() => form.validate()}
          {...form.getInputProps('email')}
          disabled={!isInvalidEmail(email)}
        />
        <TextInput
          mb={rem(4)}
          w="100%"
          required
          type="password"
          placeholder={t('Password').toString()}
          radius="md"
          autoComplete="current-password"
          // onBlurCapture={() => form.validate()}
          {...form.getInputProps('password')}
        />
        <OAMButton
          customType={OAMButtonType.DARK}
          disabled={!form.isValid()}
          mb={rem(22)}
          type="submit"
          w="100%"
          radius="lg"
          onClick={onSignIn}
        >
          {t('Sign_in')}
        </OAMButton>
        <UnstyledButton onClick={onForgotPassword} mb={rem(20)}>
          <Text className={classes.unstyleText}>{t('Forgot_password')}</Text>
        </UnstyledButton>
      </>
    );
    const googleLogin = (
      <Button
        className={classes.socialButton}
        component="a"
        href={googleSSOUrl?.href}
        target="_self"
        rel="noopener noreferrer"
        leftIcon={
          <Image
            width={20}
            src={googleIconBase64}
            alt="Google Icon"
            sx={{ position: 'relative', right: '5px', width: '0' }}
          />
        }
        styles={() => ({
          leftIcon: { width: 0, marginRight: 0 },
          inner: { position: 'relative', flex: 1 },
          label: { justifyContent: 'center', position: 'relative', width: '100%' },
        })}
      >
        {t('Sign_in_with_Google')}
      </Button>
    );
    const microsoftLogin = (
      <Button
        className={classes.socialButton}
        component="a"
        href={microsoftSSOUrl.href}
        target="_self"
        rel="noopener noreferrer"
        leftIcon={
          <Image
            width={33}
            src={microsoftIconBase64}
            alt="Google Icon"
            sx={{ position: 'relative', right: '12px', width: '0' }}
          />
        }
        styles={() => ({
          leftIcon: { width: 0, marginRight: 0 },
          inner: { position: 'relative', flex: 1 },
          label: { justifyContent: 'center', position: 'relative', width: '100%' },
        })}
      >
        {t('Sign_in_with_Microsoft')}
      </Button>
    );
    const appleLogin = (
      <Button
        className={classes.socialButton}
        component="a"
        href={appleSSOUrl.href}
        target="_self"
        rel="noopener noreferrer"
        leftIcon={
          <Image
            width={20}
            src={appleIconBase64}
            alt="Google Icon"
            sx={{ position: 'relative', right: '5px', width: '0' }}
          />
        }
        styles={() => ({
          leftIcon: { width: 0, marginRight: 0 },
          inner: { position: 'relative', flex: 1 },
          label: { justifyContent: 'center', position: 'relative', width: '100%' },
        })}
      >
        {t('Sign_in_with_Apple')}
      </Button>
    );

    return (
      <div className={classes.form}>
        <form onSubmit={form.onSubmit(() => {})}>
          <Flex h="100%" align="center" direction="column">
            {googleOnly ? <></> : loginInputs}
            {!googleOnly && isInvalidEmail(email) ? (
              <>
                <Flex w="100%" justify="center" align="center" direction="row">
                  <Text mr="xs" fz="sm">
                    {t('Register_an_Optoma_account')}
                  </Text>
                  <UnstyledButton onClick={RegisterGuidePopUp}>
                    <Text className={classes.unstyleText}> {t('Sign_up')}</Text>
                  </UnstyledButton>
                </Flex>
              </>
            ) : (
              <></>
            )}
            {!googleOnly && (
              <Divider w="100%" label={t('Or')} labelPosition="center" my="lg" color="#7B7B7B" />
            )}
            <Flex
              w="100%"
              justify="center"
              align="center"
              direction="column"
              sx={{ position: 'relative' }}
            >
              {googleLogin}
              {google || googleOnly ? <></> : microsoftLogin}
              {google || googleOnly ? <></> : appleLogin}
            </Flex>
            <PolicyLinks mt={rem(12)} />
          </Flex>
        </form>
      </div>
    );
  };

  const layout = (
    <AppShell
      padding={0}
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      <Flex
        className={classes.flex}
        w="100vw"
        h="100%"
        justify="center"
        align="center"
        wrap="nowrap"
      >
        <div className={classes.paper}>
          {renderForm({ third: third as string, email: email as string })}
        </div>
        <div className={classes.carouselGroup}>
          <div className={classes.group}>
            <Welcome />
          </div>
        </div>
      </Flex>
      <Contactus />
    </AppShell>
  );

  return token && type ? <AuthGuard>{layout}</AuthGuard> : layout;
}

export default SignInPage;
