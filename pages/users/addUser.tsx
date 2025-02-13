import React, { FormEvent, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createStyles,
  Textarea,
  Text,
  rem,
  Container,
  useMantineTheme,
  em,
  getBreakpointValue,
  Loader,
  Card,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { isEmail, useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { IUsers } from '../../utils/types';
import { OssRole, OAMRole, AccessControlModel } from '../../utils/role';
import { oamNotifications } from '../../components/base/Notifications';
import { SUPPORTED_LANGUAGES, detectLanguage } from '../../i18n/i81nTypes';
import { useSelector } from '../../store';
import Breadcrumbs from '../../components/base/Breadcrumbs';
import OAMSelect from '../../components/base/Select';
import OAMTextInput from '../../components/base/TextInput';
import OAMButton, { OAMButtonType } from '../../components/base/Button';
import { selectOrganization, selectUsers, selectLicense } from '../../store/slices';
import {
  useCreateOrganizationUserMutation,
  useLazyGetOrganizationUserCountQuery,
} from '../../store/services';
import useValidator from '../../hooks/useValidator';
import { useJWTContext } from '../../providers/jwtProvider';
import { isJSON } from '../../utils/common';
import { getOrganizationLocation } from '../../utils/location';
import useRoleOptionsTranslation from '../../hooks/useRoleOptionsTranslation';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'table',
    alignItems: 'flex-start',
    margin: '0 auto',
    width: '100%',
    justifyContent: 'center',
    borderRadius: rem(6),
    border: '1px solid #CCCCCC',
    [theme.fn.smallerThan('1024')]: {
      flexDirection: 'column',
      justifyContent: 'start',
      display: 'flex',
    },
  },
  containerData: {
    alignItems: 'flex-start',
    width: '65%',
    padding: rem(30),
    display: 'table-cell',
    justifyContent: 'left',
    borderRight: '1px solid #CCCCCC',
    [theme.fn.smallerThan('1024')]: {
      width: 'inherit',
      margin: 0,
      borderRight: 0,
      borderBottom: '1px solid #CCCCCC',
    },
    [theme.fn.smallerThan('768')]: {
      position: 'static',
      width: 'inherit',
      left: 0,
      padding: rem(20),
    },
  },
  containerDataRight: {
    alignItems: 'flex-start',
    width: '35%',
    justifyContent: 'left',
    display: 'table-cell',
    backgroundColor: 'var(--gray-f-2-f-2-f-2, #F2F2F2)',
    padding: rem(30),
    height: '-moz-available -webkit-fill-available',
    borderRadius: `0 ${rem(6)} ${rem(6)} 0`,
    [theme.fn.smallerThan('1024')]: {
      width: 'inherit',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridColumnGap: rem(30),
      borderRadius: `0 0 ${rem(6)} ${rem(6)}`,
    },
    [theme.fn.smallerThan('768')]: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 0,
      width: 'inherit',
    },
  },
  title: {
    marginBottom: rem(20),
    color: 'var(--b-2-b-primary-primary-415284, #415284)',
    fontFeatureSettings: 'clig off, liga off',
    fontSize: rem(18),
    [theme.fn.smallerThan('1024')]: {
      marginLeft: 0,
    },
  },

  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridColumnGap: rem(20),
    [theme.fn.smallerThan('768')]: {
      display: 'flex',
      flexDirection: 'column',
      width: 'inherit',
    },
  },

  btnBottom: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: `${rem(20)} 0`,
  },

  tableContainer: {
    height: rem(68),
  },

  roleRWD: {
    [theme.fn.smallerThan('768')]: {
      width: 'inherit',
    },
  },

  textArea: {
    '.mantine-Input-input': {
      height: '72px',
      ':focus': {
        borderColor: 'var(--b-2-b-primary-variant-93-a-9-c-9, #93A9C9)',
      },
    },
    label: {
      marginBottom: rem(8),
      color: '#415284',
    },
  },
}));

function AddUser() {
  const { t, i18n } = useTranslation();
  const roleOptionsTranslator = useRoleOptionsTranslation(t);
  const { classes } = useStyles();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  const [createOrganizationUser, createStatus] = useCreateOrganizationUserMutation();
  const [getOrganizationUserCount, getOrganizationUserCountStatus] =
    useLazyGetOrganizationUserCountQuery();
  const { oms, oss } = useSelector(selectLicense);
  const [userInfo, setUsersInfo] = useState<IUsers>();
  const { oamRole, email: signedEmail } = useJWTContext();
  const organization = useSelector(selectOrganization);
  const { omsUsersCount, count: userCount } = useSelector(selectUsers);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const accessControl = useMemo(
    () =>
      new AccessControlModel(
        { signedRole: oamRole as OAMRole, signedEmail },
        oms,
        oss,
        omsUsersCount,
        userCount,
      ),
    [oamRole, signedEmail, oms, oss, omsUsersCount, userCount],
  );

  const { validateUsername, validateNFC } = useValidator();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      language: i18n.language,
      nfc01: '',
      nfc02: '',
      note: '',
      oamRole: 'user',
      omsRole: 'user',
      ossRole: 'free',
      terms: true, // TODO
    },
    validate: {
      name: validateUsername,
      email: isEmail(t('Invalid_email')),
      terms: (value: boolean) => (value !== true ? t('Please_check_out_the_terms') : null),
      nfc01: validateNFC,
      nfc02: validateNFC,
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (form.validate().hasErrors) {
        return;
      }
      const formData = {
        name: form.values.name,
        email: form.values.email,
        language: form.values.language,
        nfc01: form.values.nfc01,
        nfc02: form.values.nfc02,
        note: form.values.note,
        oamRole: form.values.oamRole,
        omsRole: form.values.omsRole,
        ossRole: form.values.ossRole,
      };
      await createOrganizationUser(formData).unwrap();
      if (formData.email !== '') {
        router.push('/users');
        oamNotifications.show({
          title: t('User_added'),
        });
      }
    } catch (error: any) {
      if ((error as any).status === 409) {
        form.setFieldError('email', error.data.message);
      } else {
        oamNotifications.show({
          title: `Error: ${error.data.message}`,
        });
      }
    }
  };

  useEffect(() => {
    const isComplete = Boolean(form.values.name && form.values.email);
    setIsCompleted(isComplete);
  }, [form.values]);

  useEffect(() => {
    const { userInfo } = router.query;
    if (typeof userInfo === 'string' && isJSON(userInfo)) {
      const uInfo = JSON.parse(userInfo) as IUsers;
      setUsersInfo(uInfo);
      //form initial user value
      form.setFieldValue('name', uInfo.name);
      form.setFieldValue('email', uInfo.email);
      if (uInfo.language) form.setFieldValue('language', uInfo.language);
      if (uInfo.nfc01) form.setFieldValue('nfc01', uInfo.nfc01);
      if (uInfo.nfc02) form.setFieldValue('nfc02', uInfo.nfc02);
      if (uInfo.note) form.setFieldValue('note', uInfo.note);
      if (uInfo.oamRole) form.setFieldValue('oamRole', uInfo.oamRole);
      if (uInfo.omsRole) form.setFieldValue('omsRole', uInfo.omsRole);
      if (uInfo.ossRole) form.setFieldValue('ossRole', uInfo.ossRole);
    } else {
      try {
        form.setFieldValue('language', detectLanguage());
      } catch (e) {
        console.log('Setting system language failed:', e);
      }
    }
  }, [router.query]);

  useEffect(() => {
    getOrganizationUserCount();
  }, [userInfo]);

  useEffect(() => {
    form.setFieldValue(
      'omsRole',
      accessControl.getCountPreservedAutoOmsRole(form.values.oamRole as OAMRole),
    );
  }, [form.values.oamRole, accessControl]);

  const mobileLayout = (
    <form onSubmit={handleSubmit}>
      {/* left table */}
      <div className={classes.container}>
        <div className={classes.containerData}>
          <div className={classes.gridContainer}>
            <div>
              <Text color="#415284" pb="xs">
                {t('Organization_name')}
              </Text>
              <div className={classes.tableContainer}>
                <div>{organization.name}</div>
                <Text mb={20}>{getOrganizationLocation(organization)}</Text>
              </div>
              <Text color="#415284" pb="xs">
                {t('Organization_type')}
              </Text>
              <div className={classes.tableContainer}>
                <div>{organization.type}</div>
              </div>
              <OAMTextInput
                label={t('Username')}
                required
                onBlurCapture={() => form.validate()}
                {...form.getInputProps('name')}
              />
              <OAMTextInput
                label={t('Email')}
                required
                error={form.errors.email && t('Invalid_email')}
                onBlurCapture={() => form.validate()}
                {...form.getInputProps('email')}
              />
              <OAMSelect
                required
                {...form.getInputProps('language')}
                label={t('Language')}
                rightSection={<IconChevronDown size="1rem" />}
                styles={{ rightSection: { pointerEvents: 'none' } }}
                data={SUPPORTED_LANGUAGES.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))}
              />
            </div>

            <div>
              <OAMTextInput label={t('NFC_card_01')} {...form.getInputProps('nfc01')} />
            </div>
          </div>
          <div className={classes.gridContainer}>
            <div>
              <OAMTextInput label={t('NFC_card_02')} {...form.getInputProps('nfc02')} />
            </div>
          </div>
          <Textarea
            label={t('Note')}
            className={classes.textArea}
            {...form.getInputProps('note')}
          />
        </div>

        {/* right table with grey background */}
        <div className={classes.containerDataRight}>
          <div className={classes.roleRWD}>
            <Text color="#415284" pb="xs">
              {t('OAM_role')}
            </Text>
            <OAMSelect
              disabled={accessControl.isAddItemOamRoleDisabled()}
              required
              placeholder="User"
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={roleOptionsTranslator(accessControl.getAddableAssignableOamRoles())}
              autoSelect
              {...form.getInputProps('oamRole')}
            />
          </div>
          <div className={classes.roleRWD}>
            <Text color="#415284" pb="xs">
              {t('OMS_role')}
            </Text>
            <OAMSelect
              disabled={accessControl.isAddItemOmsRoleDisabled()}
              required
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={roleOptionsTranslator(
                accessControl.getAssignableOmsRoles(form.values.oamRole as OAMRole),
              )}
              autoSelect
              {...form.getInputProps('omsRole')}
            />
          </div>
          <div className={classes.roleRWD}>
            <Text color="#415284" pb="xs">
              {t('OSS_role')}
            </Text>
            <OAMSelect
              disabled
              required
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={roleOptionsTranslator(OssRole)}
              autoSelect
              {...form.getInputProps('ossRole')}
            />
          </div>
        </div>
      </div>
      <div className={classes.btnBottom}>
        <OAMButton
          customType={OAMButtonType.LIGHT_OUTLINE}
          mr="md"
          radius="xl"
          onClick={() => router.push('/users')}
        >
          {t('Cancel')}
        </OAMButton>
        <OAMButton
          customType={OAMButtonType.DARK}
          type="submit"
          px="xl"
          radius="xl"
          disabled={!isCompleted || createStatus.isLoading || !form.values.terms}
        >
          {t('Add')}
        </OAMButton>
      </div>
    </form>
  );

  const layout = (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <div className={classes.containerData}>
          <div className={classes.gridContainer}>
            <div>
              <Text color="#415284" pb="xs">
                {t('Organization_name')}
              </Text>
              <div className={classes.tableContainer}>
                <div>{organization.name}</div>
                <Text mb={20}>{getOrganizationLocation(organization)}</Text>
              </div>
              <OAMTextInput
                label={t('Username')}
                required
                onBlurCapture={() => form.validate()}
                {...form.getInputProps('name')}
              />

              <OAMSelect
                required
                label={t('Language')}
                rightSection={<IconChevronDown size="1rem" />}
                styles={{ rightSection: { pointerEvents: 'none' } }}
                data={SUPPORTED_LANGUAGES.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))}
                {...form.getInputProps('language')}
              />
            </div>
            <div>
              <Text color="#415284" pb="xs">
                {t('Organization_type')}
              </Text>
              <div className={classes.tableContainer}>
                <Text mb="xl">{organization.type}</Text>
              </div>
              <div>
                <OAMTextInput
                  label={t('Email')}
                  required
                  error={form.errors.email && t('Invalid_email')}
                  onBlurCapture={() => form.validate()}
                  {...form.getInputProps('email')}
                />

                <OAMTextInput label={t('NFC_card_01')} {...form.getInputProps('nfc01')} />
              </div>
            </div>
          </div>
          <div className={classes.gridContainer}>
            <div>
              <OAMTextInput label={t('NFC_card_02')} {...form.getInputProps('nfc02')} />
            </div>
          </div>
          <Textarea
            label={t('Note')}
            className={classes.textArea}
            {...form.getInputProps('note')}
          />
        </div>

        {/* right table with grey background */}
        <div className={classes.containerDataRight}>
          <div>
            <Text color="#415284" pb="xs">
              {t('OAM_role')}
            </Text>
            <OAMSelect
              disabled={accessControl.isAddItemOamRoleDisabled()}
              required
              placeholder="User"
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={roleOptionsTranslator(accessControl.getAddableAssignableOamRoles())}
              autoSelect
              {...form.getInputProps('oamRole')}
            />
          </div>
          <div>
            <Text color="#415284" pb="xs">
              {t('OMS_role')}
            </Text>
            <OAMSelect
              disabled={accessControl.isAddItemOmsRoleDisabled()}
              required
              placeholder="- -"
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={roleOptionsTranslator(
                accessControl.getAssignableOmsRoles(form.values.oamRole as OAMRole),
              )}
              autoSelect
              {...form.getInputProps('omsRole')}
            />
          </div>
          <div>
            <Text color="#415284" pb="xs">
              {t('OSS_role')}
            </Text>
            <OAMSelect
              disabled
              required
              placeholder="Free"
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={roleOptionsTranslator(OssRole)}
              autoSelect
              {...form.getInputProps('ossRole')}
            />
          </div>
        </div>
      </div>
      <div className={classes.btnBottom}>
        <OAMButton
          customType={OAMButtonType.LIGHT_OUTLINE}
          mr="md"
          radius="xl"
          onClick={() => router.push('/users')}
        >
          {t('Cancel')}
        </OAMButton>
        <OAMButton
          customType={OAMButtonType.DARK}
          type="submit"
          px="xl"
          radius="xl"
          disabled={!isCompleted || !form.values.terms}
        >
          {createStatus.isLoading ? <Loader size="sm" color="gray" /> : <>{t('Add')}</>}
        </OAMButton>
      </div>
    </form>
  );

  return (
    <Container fluid px="lg" pb={60}>
      <Breadcrumbs start={1} end={3} />
      <Card.Section className={classes.title}>
        <Text>{t('Add_user')}</Text>
      </Card.Section>
      {isMobile ? mobileLayout : layout}
    </Container>
  );
}

export default AddUser;

AddUser.requireAuth = true;
