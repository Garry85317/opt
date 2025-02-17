import {
  Anchor,
  AppShell,
  createStyles,
  Flex,
  Grid,
  Group,
  Paper,
  rem,
  ScrollArea,
  Text,
} from '@mantine/core';
import { isNotEmpty, isEmail, matchesField, useForm } from '@mantine/form';
import { useViewportSize } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useEffectOnce } from 'usehooks-ts';
import ReCAPTCHA from 'react-google-recaptcha';
import HeaderBar, { IconTheme } from '../../components/headerBar';
import LanguageMenu from '../../components/headerBar/language';
import { detectLanguage, SUPPORTED_LANGUAGES } from '../../i18n/i81nTypes';
import { usePopup } from '../../providers/popupProvider';
import { AGE_DATA, PASSWORD_REGEX, TYPE_DATA } from '../../utils/constant';
import CheckPassword from '../../components/CheckPassword';
import TextInput, { OAMTextInputType } from '../../components/base/TextInput';
import Select, { OAMSelectType } from '../../components/base/Select';
import Checkbox from '../../components/base/Checkbox';
import Button, { OAMButtonType } from '../../components/base/Button';
import { useSignUpMutation } from '../../store/services';
import { OrganizationType } from '../../utils/types';
import useEmailQuery from '../../hooks/useEmailQuery';
import useValidator from '../../hooks/useValidator';
import { LocationInput } from '../../components/input/Location';
import toI18nKey from '../../i18n/extraI18nKeys';
import useCriticalLoadingAction from '../../hooks/useCriticalLoadingAction';
import Welcome from '../../components/welcome';
import Contactus from '../../components/ContactUs';

const useStyles = createStyles((theme) => ({
  flex: {
    background: '#F2F2F2',
    [theme.fn.smallerThan('768')]: {
      backgroundColor: 'white',
    },
  },
  already: {
    marginBottom: rem(20),
    [theme.fn.smallerThan('768')]: {
      margin: `0 ${rem(20)} 0 ${rem(20)}`,
      padding: 0,
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

const SignUp = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const { t } = useTranslation();
  const { message } = usePopup();
  const { width } = useViewportSize();
  const [signUp] = useSignUpMutation();
  const isInvalidEmail = isEmail(t('Invalid_email'));
  const { type: fromType, state: fromState } = router.query;
  const { enterLoading, leaveLoading } = useCriticalLoadingAction();
  const reCaptchaRef = useRef<ReCAPTCHA>(null);

  const { validateUsername } = useValidator();
  const form = useForm({
    initialValues: {
      email: '',
      userName: '',
      password: '',
      confirmPassword: '',
      terms: false,
      language: '',
      age: AGE_DATA[0].key,
      timezone: '',
      organizationType: TYPE_DATA[0].key,
      organizationName: '',
      othersName: '',
      guardianEmail: '',
      country: '',
      city: '',
      state: '',
      address: '',
      phone: '',
      avatar: '',
      recaptcha: null,
    },
    validateInputOnBlur: true,
    validate: {
      userName: validateUsername,
      email: isInvalidEmail,
      password: (value) => {
        if (!PASSWORD_REGEX.test(value)) {
          return t('Password_format_error');
        }
        return null;
      },
      confirmPassword: matchesField('password', t('Passwords_do_not_match')),
      organizationName: (value) => {
        if (value.trim() === '') {
          return t('Invalid_organization_name');
        }
        return null;
      },
      guardianEmail: (value, values) => {
        if (values.age === 'above_thirteen') {
          return null;
        }
        if (/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
          return null;
        }
        return t('Invalid_email');
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
    if (form.values.password) {
      form.validateField('password');
    }
    if (form.values.confirmPassword) {
      form.validateField('confirmPassword');
    }
  }, [form.values.password, form.values.confirmPassword]);

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
    [TYPE_DATA, t],
  );

  const register = async () => {
    if (form.validate().hasErrors || !form.values.recaptcha) {
      return;
    }
    enterLoading();
    let orgName = form.values.organizationName;
    // TODO: Mantis #20109: short term fix for individual name shouldn't be modify twice
    if (orgName === 'Individual') {
      orgName = 'Individual ';
    }

    const signInFrom = `${fromType ?? ''}`;
    const signInState = `${fromState ?? ''}`;
    const formData = {
      name: form.values.userName,
      email: form.values.email,
      password: form.values.password,
      language: form.values.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      organization: {
        type: form.values.organizationType.toLowerCase(),
        name: orgName, //`com.${form.values.organizationName}.testing`.toLowerCase(),
        country: form.values.country,
        city: form.values.city,
        state: form.values.state,
        address: form.values.address,
        phone: form.values.phone,
        ...(form.values.organizationType === OrganizationType.Others
          ? { othersName: form.values.othersName }
          : {}),
      },
      guardianEmail: form.values.guardianEmail,
      type: signInFrom,
      state: signInState,
      avatar: form.values.avatar,
    };

    await signUp({ data: formData, recaptcha: form.values.recaptcha })
      .unwrap()
      .then(({ data: signUpData }) => {
        message.open({
          tit: t('Check_registration_email_title'),
          msg: `${t('Check_registration_email_content')}\n\n${t('Check_spam_folder')}`,
          rightBtn: t('Ok'),
          rightBtnClick: () => {
            if (signUpData.hasRedirect && signUpData.redirectUrl !== undefined) {
              router.push(signUpData.redirectUrl);
              return;
            }
            router.replace({ pathname: '/auth/signIn', query: router.query });
          },
        });
      })
      .catch((err) => {
        console.log(err);
        message.open({
          tit: t('Error'),
          msg: t(toI18nKey(err.data.message) || 'Unknown_error'),
          rightBtn: t('Close'),
        });

        reCaptchaRef.current!.reset();
        form.setFieldValue('recaptcha', null);
      })
      .finally(leaveLoading);
  };
  const onRegister = useCallback(register, [form]);

  useEffectOnce(() => {
    // setup language
    try {
      form.setFieldValue('language', detectLanguage());
    } catch (e) {
      console.log('Setting system language failed:', e);
    }
  });

  useEmailQuery(form);

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
        <ScrollArea className={classes.paper}>
          <form onSubmit={form.onSubmit(() => {})} className={classes.form}>
            <Text color="#415284" className={classes.formTitle}>
              {"Profile"}
            </Text>
            {/* <Flex className={classes.already}>
              <Text>{t('Already_have_an_account')}</Text>
              <Anchor
                ml={rem(5)}
                onClick={() => {
                  router.replace({ pathname: '/auth/signIn', query: router.query });
                }}
              >
                <Text td="underline">{t('Sign_in')}</Text>
              </Anchor>
            </Flex> */}
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
                    required
                    label={t('Email')}
                    {...form.getInputProps('email')}
                    radius="md"
                    disabled={!isInvalidEmail(router.query.email as string)}
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
                  <CheckPassword {...form.getInputProps('password')} />
                </Grid.Col>
                <Grid.Col className={classes.col} span={1}>
                  <TextInput
                    customType={OAMTextInputType.BORDER}
                    type="password"
                    required
                    label={t('Confirm_password')}
                    placeholder={t('Your_password').toString()}
                    {...form.getInputProps('confirmPassword')}
                    radius="md"
                  />
                </Grid.Col>
              </Grid>
              {/* <Grid
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
                    placeholder={t('Select')?.toString()}
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
                <Grid.Col p={0} span={1} />
              </Grid> */}
            </Paper>
            <Paper radius="md" className={classes.formGroup}>
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
              </Grid>
              <Grid
                className={classes.grid}
                columns={width > 768 ? 2 : 1}
                justify="center"
                align="center"
              >
                {/* <Grid.Col className={classes.col} span={1}>
                  <Select
                    required
                    customType={OAMSelectType.BORDER}
                    radius="md"
                    label={t('Organization_type')}
                    rightSection={<IconChevronDown size="1rem" />}
                    dropdownPosition="bottom"
                    defaultValue={OrganizationType.Others}
                    data={typeData}
                    {...form.getInputProps('organizationType')}
                  />
                </Grid.Col> */}
                {form.values.organizationType === OrganizationType.Others ? (
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
            {/* <Paper radius="md" className={classes.anchor}>
              <Checkbox
                className={classes.checkbox}
                styles={() => ({
                  body: {
                    alignItems: 'center',
                  },
                })}
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
            </Paper> */}
            {/* <Group className={classes.reCaptcha} position="left">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                {...form.getInputProps('recaptcha')}
                ref={reCaptchaRef}
              />
            </Group> */}
            <Group className={classes.buttonGroup} position="right">
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
                {"Setup"}
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
};

export default SignUp;
