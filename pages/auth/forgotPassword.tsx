import { AppShell, createStyles, Flex, rem, Text, UnstyledButton } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../components/base/TextInput';
import { usePopup } from '../../providers/popupProvider';
import HeaderBar, { IconTheme } from '../../components/headerBar';
import LanguageMenu from '../../components/headerBar/language';
import Welcome from '../../components/welcome';
import Button, { OAMButtonType } from '../../components/base/Button';
import { useResendRegisterMutation, useForgetPasswordMutation } from '../../store/services';
import Contactus from '../../components/ContactUs';

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
  button: {
    [theme.fn.smallerThan('768')]: {
      marginTop: '10px',
    },
  },
}));

function ForgotPasswordPage() {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { message } = usePopup();
  const [resendRegister] = useResendRegisterMutation();
  const [forgotPassword] = useForgetPasswordMutation();
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail(t('Invalid_email')),
    },
  });

  const onBackToSignIn = () => {
    router.replace({ pathname: '/auth/signIn', query: router.query });
  };

  const onResend = useCallback(() => {
    resendRegister({ email: form.values.email })
      .unwrap()
      .then((res) => {
        if (res) {
          message.open({
            tit: t(''),
            msg: t('Verification_letter_resend_successfully'),
            rightBtn: t('Ok'),
            rightBtnClick: onBackToSignIn,
          });
        } else {
          onBackToSignIn();
        }
      })
      .catch(onBackToSignIn);
  }, [form]);

  const onSendForgotPassword = () => {
    const { email } = form.values;
    console.log('Sending email:', email);
    forgotPassword({ email })
      .unwrap()
      .then(() => {
        message.open({
          tit: t('Request_sent_to_your_email'),
          msg: t('Please_check_your_email_to_reset_your_password'),
          rightBtn: t('Ok'),
          rightBtnClick: onBackToSignIn,
        });
      })
      .catch((err) => {
        console.log('Error:', err);
        message.open({
          tit: '',
          msg: t('The_email_or_password_you_have_provided_is_incorrect'),
          rightBtn: t('Ok'),
          rightBtnClick: onBackToSignIn,
        });
      });
  };

  return (
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
          <div className={classes.form}>
            <form onSubmit={form.onSubmit(() => {})}>
              <Flex h="100%" align="center" direction="column">
                <Text color="#415284" mb={rem(24)} align="left" w="100%" fz={18} fw={500}>
                  {t('Forgot_password')}
                </Text>
                <TextInput
                  mb={rem(12)}
                  w="100%"
                  required
                  placeholder={t('Email').toString()}
                  radius="md"
                  onBlurCapture={() => form.validate()}
                  type="email"
                  {...form.getInputProps('email')}
                />
                <Button
                  customType={OAMButtonType.DARK}
                  disabled={!form.isValid()}
                  mb={rem(22)}
                  color="#415284"
                  type="submit"
                  w="100%"
                  radius="lg"
                  onClick={onSendForgotPassword}
                  className={classes.button}
                >
                  {t('Send')}
                </Button>
                <Flex w="100%" justify="center" align="center" direction="row">
                  <Text fz={14} size="xs" mr={rem(10)}>
                    {t('Back_to')}
                  </Text>
                  <UnstyledButton onClick={onBackToSignIn}>
                    <Text fz={14} color="#465EE3" td="underline">
                      {t('Sign_in')}
                    </Text>
                  </UnstyledButton>
                </Flex>
              </Flex>
            </form>
          </div>
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
}

export default ForgotPasswordPage;
