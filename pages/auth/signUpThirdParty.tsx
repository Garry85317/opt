import {
  Anchor,
  AppShell,
  createStyles,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  rem,
  ScrollArea,
  Text,
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useViewportSize } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useEffectOnce } from 'usehooks-ts';
import ReCAPTCHA from 'react-google-recaptcha';
import Checkbox from '../../components/base/Checkbox';
import Select, { OAMSelectType } from '../../components/base/Select';
import TextInput, { OAMTextInputType } from '../../components/base/TextInput';
import Button, { OAMButtonType } from '../../components/base/Button';
import HeaderBar, { IconTheme } from '../../components/headerBar';
import LanguageMenu from '../../components/headerBar/language';
import { LocationInput } from '../../components/input/Location';
import { detectLanguage, SUPPORTED_LANGUAGES } from '../../i18n/i81nTypes';
import { useJWTContext } from '../../providers/jwtProvider';
import { usePopup } from '../../providers/popupProvider';
import { useDispatch, useSelector } from '../../store';
import { clearAuthInfo } from '../../store/actions';
import {
  useAgeDeactiveMutation,
  useLazyUserExistsQuery,
  useLazyUserFirstLoginQuery,
  usePassportQRCodeMutation,
} from '../../store/services';
import { selectAccessToken } from '../../store/slices';
import { firstLogin as FirstLogin, OrganizationType } from '../../utils/types';
import { throttle } from '../../utils/timeout';
import { AGE_DATA, TYPE_DATA } from '../../utils/constant';
import Welcome from '../../components/welcome';
import { CustomLoader } from '../../components/customLoader';
import Contactus from '../../components/ContactUs';

const useStyles = createStyles((theme) => ({
  flex: {
    background: '#F2F2F2',
    [theme.fn.smallerThan('768')]: {
      backgroundColor: 'white',
    },
  },
  paper: {
    width: '750px',
    height: '90vh',
    flex: '1',
    [theme.fn.smallerThan('1024')]: {
      width: '100%',
    },
    [theme.fn.smallerThan('768')]: {
      width: '100%',
      padding: rem(0),
      borderRadius: '0',
      background: 'white',
    },
  },
  form: {
    margin: '50px 70px',
    [theme.fn.smallerThan('768')]: {
      margin: `0 0 ${rem(30)} 0`,
    },
  },
  formTitle: {
    fontSize: rem(18),
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    margin: `0 0 ${rem(20)} 0`,
    [theme.fn.smallerThan('768')]: {
      margin: `0 0 ${rem(24)} ${rem(20)}`,
    },
  },
  formGroup: {
    marginBottom: rem(20),
    padding: `${rem(24)} ${rem(15)}`,
    [theme.fn.smallerThan('768')]: {
      margin: `0 ${rem(5)} 0 ${rem(5)}`,
      padding: 0,
    },
  },
  groupTitle: {
    margin: `0 0 ${rem(20)} ${rem(15)}`,
    fontSize: rem(14),
    [theme.fn.smallerThan('768')]: {
      margin: `0 0 ${rem(20)} ${rem(15)}`,
    },
  },
  grid: {
    margin: 0,
  },
  col: {
    marginBottom: rem(4),
    padding: `${rem(0)} ${rem(15)} ${rem(0)} ${rem(15)}`,
  },
  anchor: {
    padding: rem(18),
    marginBottom: rem(20),
    [theme.fn.smallerThan('768')]: {
      paddingTop: rem(0),
      paddingBottom: rem(80),
    },
  },
  checkbox: {
    justifyContent: 'flex-start',
    paddingLeft: rem(15),
    [theme.fn.smallerThan('768')]: {
      justifyContent: 'center',
      paddingLeft: rem(0),
    },
  },
  buttonGroup: {
    [theme.fn.smallerThan('768')]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  reCaptcha: {
    [theme.fn.smallerThan('768')]: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: rem(20),
    },
  },
  button: {
    [theme.fn.smallerThan('768')]: {
      width: '80vw',
    },
  },
  CarouselGroup: {
    backgroundColor: '#415284',
    width: '45.4%',
    height: '100%',
    position: 'relative',
    [theme.fn.smallerThan('1024')]: {
      display: 'none',
    },
  },
  group: {
    paddingTop: '11.2%',
    paddingBottom: '5.6%',
    paddingLeft: 'max(40px, 5%)',
    paddingRight: 'max(40px, 5%)',
    height: '100%',
  },
  title: {
    color: 'white',
    textAlign: 'left',
    fontWeight: 500,
    fontSize: '35px',
  },
  content: {
    color: 'white',
    textAlign: 'left',
    fontWeight: 400,
    fontSize: '20px',
  },
}));

const SignUpThirdParty = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { type: fromType, state: fromState, meta: qsMeta } = router.query;
  const token = useSelector(selectAccessToken);
  const { width } = useViewportSize();
  const [firstLogin] = useLazyUserFirstLoginQuery();
  const [userExists] = useLazyUserExistsQuery();
  const { message } = usePopup();
  const [ageDeactive] = useAgeDeactiveMutation();
  const [accept, setAccept] = useState<boolean>(false);
  const [passportQRCode] = usePassportQRCodeMutation();

  const { email, meta } = useJWTContext();
  const isPrivateEmail = meta && 'isPrivateEmail' in meta && meta.isPrivateEmail;

  const form = useForm({
    initialValues: {
      email: '',
      userName: '',
      terms: false,
      language: '',
      age: AGE_DATA[0].key,
      organizationType: TYPE_DATA[0].key,
      organizationName: '',
      country: '',
      othersName: '',
      recaptcha: null,
    },
    validateInputOnBlur: true,
    validate: {
      userName: (value) => {
        if (value.trim() === '') {
          return t('Invalid_User_Name');
        }
        return null;
      },
      email: isEmail(t('Invalid_email')),
      organizationName: (value) => {
        if (value.trim() === '') {
          return t('Invalid_organization_name');
        }
        return null;
      },
      country: isNotEmpty(),
      othersName: (value, values) => {
        if (values.organizationType !== 'Others') {
          return null;
        }
        if (value) {
          return null;
        }
        return t('Invalid_othersName');
      },
      recaptcha: isNotEmpty(),
    },
  });

  useEffect(() => {
    form.setFieldValue('email', isPrivateEmail ? '' : email);
  }, [email, isPrivateEmail]);

  const ageData = useMemo(
    () =>
      AGE_DATA.map((item) => ({
        label: t(item.namespace),
        value: item.key,
      })),
    [AGE_DATA],
  );

  const typeData = useMemo(
    () =>
      TYPE_DATA.map((item) => ({
        label: t(item.namespace),
        value: item.key,
      })),
    [TYPE_DATA],
  );

  const register = async () => {
    if (form.validate().hasErrors || !form.values.recaptcha) {
      return;
    }
    const formData: FirstLogin = {
      data: {
        name: form.values.userName,
        language: form.values.language,
        organization: {
          type: form.values.organizationType.toLowerCase(),
          country: form.values.country,
          name: `${form.values.organizationName}`,
          ...(form.values.organizationType === OrganizationType.Others
            ? { othersName: form.values.othersName }
            : {}),
        },
        state: `${fromState ?? ''}`,
        type: `${fromType ?? ''}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      recaptcha: form.values.recaptcha,
    };

    if (isPrivateEmail) {
      const isExists = await userExists({ email: form.getInputProps('email').value }).unwrap();
      if (isExists.data.exists) {
        message.open({
          tit: t('Error'),
          msg: t('Email_is_exists'),
          rightBtn: t('Close'),
        });
        return;
      }

      formData.data.email = form.values.email;
    }

    try {
      const res = await firstLogin(formData).unwrap();
      const { data } = res;

      if (isPrivateEmail) {
        message.open({
          tit: t('Check_registration_email_title'),
          msg: `${t('Check_registration_email_content')}\n\n${t('Check_spam_folder')}`,
          rightBtn: t('Ok'),
          rightBtnClick: () => {
            if (router.query?.deleteAccount) {
              router.replace({ pathname: '/account', query: router.query });
              return;
            }
            if (data.hasRedirect && data.redirectUrl !== undefined) {
              router.replace(data.redirectUrl);
              return;
            }
            router
              .replace({ pathname: '/auth/signIn', query: router.query })
              .catch((err) => console.error(err));
          },
        });
      } else if (data.hasRedirect && data.redirectUrl !== undefined) {
        router.replace(data.redirectUrl);
      } else {
        //router.replace('/dashboard').catch((err) => console.error(err));
        window.location.href = '/dashboard'; // reload to switch zendesk chat bot
      }
    } catch (err: any) {
      console.log(err);
      // 400, 401, 404, 500
      const msg = 'data' in err && 'message' in err.data ? err.data.message : t('Unknown_error');

      message.open({
        tit: t('Error'),
        msg,
        rightBtn: t('Close'),
      });
    }
  };
  const onRegister = useCallback(throttle(register), [form]);

  const render = () => (
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
        <ScrollArea className={classes.paper}>
          <form onSubmit={form.onSubmit(() => {})} className={classes.form}>
            <Text color="#415284" className={classes.formTitle}>
              {t('Sign_up')}
            </Text>
            <Paper className={classes.formGroup} radius="md">
              <Text className={classes.groupTitle}>{t('General')}</Text>
              <Grid
                className={classes.grid}
                columns={width > 768 ? 2 : 1}
                justify="center"
                align="center"
              >
                <Grid.Col className={classes.col} span={1}>
                  <TextInput
                    customType={OAMTextInputType.BORDER}
                    required
                    label={t('Username')}
                    {...form.getInputProps('userName')}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col className={classes.col} span={1}>
                  <TextInput
                    customType={OAMTextInputType.BORDER}
                    disabled={!isPrivateEmail}
                    withAsterisk
                    label={t('Email')}
                    {...form.getInputProps('email')}
                    placeholder=""
                    radius="md"
                  />
                </Grid.Col>
              </Grid>
              <Grid
                className={classes.grid}
                columns={width > 768 ? 2 : 1}
                justify="center"
                align="center"
              >
                <Grid.Col className={classes.col} span={1}>
                  <Select
                    required
                    customType={OAMSelectType.BORDER}
                    radius="md"
                    {...form.getInputProps('language')}
                    label={t('Language')}
                    rightSection={<IconChevronDown size="1rem" />}
                    defaultValue={SUPPORTED_LANGUAGES[0].value}
                    data={SUPPORTED_LANGUAGES.map((item) => ({
                      label: item.label,
                      value: item.value,
                    }))}
                  />
                </Grid.Col>
                <Grid.Col className={classes.col} span={1} />
              </Grid>
            </Paper>
            <Paper className={classes.formGroup} radius="md">
              <Text className={classes.groupTitle}>{t('Organization')}</Text>
              <Grid
                className={classes.grid}
                columns={width > 768 ? 2 : 1}
                justify="center"
                align="center"
              >
                <Grid.Col className={classes.col} span={1}>
                  <TextInput
                    customType={OAMTextInputType.BORDER}
                    required
                    label={t('Name')}
                    {...form.getInputProps('organizationName')}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col className={classes.col} span={1}>
                  <LocationInput
                    hasLabel
                    required
                    radius="md"
                    // defaultValue={form.values.country}
                    {...form.getInputProps('country')}
                  />
                </Grid.Col>
                <Grid.Col p={0} span={1} />
              </Grid>
              <Grid
                className={classes.grid}
                columns={width > 768 ? 2 : 1}
                justify="center"
                align="center"
              >
                <Grid.Col className={classes.col} span={1}>
                  <Select
                    required
                    customType={OAMSelectType.BORDER}
                    radius="md"
                    label={t('Organization_type')}
                    rightSection={<IconChevronDown size="1rem" />}
                    dropdownPosition="bottom"
                    data={typeData}
                    {...form.getInputProps('organizationType')}
                  />
                </Grid.Col>
                {form.values.organizationType === 'Others' ? (
                  <Grid.Col className={classes.col} span={1}>
                    <TextInput
                      customType={OAMTextInputType.BORDER}
                      required
                      label={t('Others')}
                      {...form.getInputProps('othersName')}
                      radius="md"
                    />
                  </Grid.Col>
                ) : (
                  width > 768 && <Grid.Col p={0} span={1} />
                )}
                <Grid.Col p={0} span={1} />
              </Grid>
            </Paper>
            <Paper radius="md" className={classes.anchor}>
              <Checkbox
                className={classes.checkbox}
                label={
                  <Trans
                    i18nKey="Agree_with"
                    components={{
                      1: <Anchor td="underline" href="/termsConditions" target="_blank" />,
                      2: <Anchor td="underline" href="/privacy" target="_blank" />,
                      3: <Anchor td="underline" href="/cookiesPolicy" target="_blank" />,
                      br: <br />,
                    }}
                  />
                }
                {...form.getInputProps('terms', { type: 'checkbox' })}
              />
            </Paper>
            <Group className={classes.reCaptcha} position="left">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                {...form.getInputProps('recaptcha')}
              />
            </Group>
            <Group className={classes.buttonGroup} position="right" mt="xl">
              <Button
                className={classes.button}
                customType={OAMButtonType.DARK}
                disabled={!form.isValid() || !form.values.terms}
                onClick={onRegister}
                miw={rem(80)}
                type="submit"
                styles={() => ({
                  root: {
                    '&:disabled': {
                      backgroundColor: '#415284',
                      opacity: 0.4,
                    },
                  },
                })}
                radius="xl"
                sx={{
                  background: '#415284',
                }}
              >
                {/* TODO: Register hover style */}
                {t('Register')}
              </Button>
            </Group>
          </form>
        </ScrollArea>
        <div className={classes.CarouselGroup}>
          <div className={classes.group}>
            <Welcome />
          </div>
        </div>
      </Flex>
      <Contactus />
    </AppShell>
  );

  useEffectOnce(() => {
    try {
      form.setFieldValue('language', detectLanguage());
    } catch (e) {
      console.log('Setting system language failed:', e);
    }
  });

  if (!token) {
    dispatch(clearAuthInfo());
    // TODO should preserve router query ?
    router.push('/auth/signIn');
    return <></>;
  }

  useEffect(() => {
    let qsMetaObj;
    try {
      qsMetaObj = JSON.parse(qsMeta as string);
    } catch (err) {
      qsMetaObj = {};
    }

    const skip = 'skip' in qsMetaObj ? qsMetaObj.skip : false;

    if (!skip) {
      const msg = (
        <>
          {t('To_create_an_admin_account_of_Optoma_account_platform')
            .split('.')
            .map((str, index) => (str ? <Text key={index}>{`${str}.`}</Text> : <br key={index} />))}
        </>
      );
      message.open({
        tit: t('Register'),
        msg,
        rightBtn: t('Create_admin'),
        rightBtnClick: () => {
          message.close();
          try {
            const qsMetaObj = JSON.parse(qsMeta as string);
            passportQRCode({
              qrcode: qsMetaObj?.qrcode,
            }).unwrap();
          } catch (err) {
            /* empty */
          }

          setAccept(true);
        },
        leftBtn: t('Cancel'),
        leftBtnClick: () => {
          ageDeactive()
            .then(() => {
              router.push('/auth/signIn');
            })
            .catch(() => {
              router.push('/auth/signIn');
            });
        },
      });
    } else {
      try {
        const qsMetaObj = JSON.parse(qsMeta as string);
        passportQRCode({
          qrcode: qsMetaObj?.qrcode,
        }).unwrap();
      } catch (err) {
        /* empty */
      }

      setAccept(true);
    }
  }, []);

  if (accept) {
    return render();
  }

  return (
    <LoadingOverlay overlayBlur={2} loader={CustomLoader({ loadingText: t('Loading') })} visible />
  );
};

export default SignUpThirdParty;
