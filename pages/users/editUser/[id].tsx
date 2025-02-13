import {
  Container,
  Card,
  Loader,
  Text,
  Textarea,
  createStyles,
  em,
  getBreakpointValue,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../../components/base/Breadcrumbs';
import {
  oamNotifications,
  oamNotificationsShowUntil,
} from '../../../components/base/Notifications';
import OAMButton, { OAMButtonType } from '../../../components/base/Button';
import OAMSelect from '../../../components/base/Select';
import OAMTextInput from '../../../components/base/TextInput';
import { SUPPORTED_LANGUAGES, detectLanguage } from '../../../i18n/i81nTypes';
import { usePopup } from '../../../providers/popupProvider';
import { useSelector, useDispatch } from '../../../store';
import {
  useLazyGetOrganizationUserQuery,
  useLazyGetOrganizationUserCountQuery,
  useSendOrganizationUserInvitationMutation,
  useUpdateOrganizationUserMutation,
  useUpdateMultiOrganizationUserRolesMutation,
} from '../../../store/services';
import {
  selectOrganization,
  selectUsers,
  selectAccount,
  selectLicense,
} from '../../../store/slices';
import {
  OAMRole,
  OMSRole,
  OamRole,
  OmsRole,
  OssRole,
  Role,
  AccessControlModel,
} from '../../../utils/role';
import { IUsers, PackageStatus, PackageStatusCheckResult } from '../../../utils/types';
import useValidator from '../../../hooks/useValidator';
import { useJWTContext } from '../../../providers/jwtProvider';
import { getOrganizationLocation } from '../../../utils/location';
import useUserDataTransfer from '../../../hooks/useUserDataTransfer';
import useRoleOptionsTranslation from '../../../hooks/useRoleOptionsTranslation';
import { getErrorMessage } from '../../../utils/events';
import { clearAuthInfo } from '../../../store/actions';

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
  resend: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: rem(20),
    marginBottom: rem(20),
    padding: rem(16),
    borderRadius: rem(6),
    border: `${rem(1)} solid #CCCCCC`,
    [theme.fn.smallerThan('768')]: {
      flexDirection: 'column',
      alignItems: 'flex-end',
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

function EditUser() {
  const { t, i18n } = useTranslation();
  const roleOptionsTranslator = useRoleOptionsTranslation(t);
  const { classes } = useStyles();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  const { oamRole, email: signedEmail } = useJWTContext();
  const [updateOrganizationUser, updateStatus] = useUpdateOrganizationUserMutation();
  const [updateMultiOrganizationUserRoles, updateMultiRoleStatus] =
    useUpdateMultiOrganizationUserRolesMutation();
  const { oms, oss } = useSelector(selectLicense);
  const [userInfo, setUsersInfo] = useState<IUsers>();
  const organization = useSelector(selectOrganization);
  const { omsUsersCount, count: userCount } = useSelector(selectUsers);
  const { message } = usePopup();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const [getOrganizationUserCount, getOrganizationUserCountStatus] =
    useLazyGetOrganizationUserCountQuery();
  const [getOrganizationUser, getOrganizationUserStatus] = useLazyGetOrganizationUserQuery();
  const [sendOrganizationsUserInvitation, resendStatus] =
    useSendOrganizationUserInvitationMutation();
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
      id: '',
      name: '',
      email: '',
      language: i18n.language,
      nfc01: '',
      nfc02: '',
      note: '',
      oamRole: 'user',
      omsRole: '',
      ossRole: 'free',
    },

    validate: {
      name: validateUsername,
      email: isEmail(t('Invalid_email')),
      nfc01: validateNFC,
      nfc02: validateNFC,
    },
  });
  const account = useSelector(selectAccount);
  const disabledOAMRole = userInfo ? accessControl.isItemOamRoleDisabled(userInfo) : true;
  const disabledOAMRoleLabel = OamRole.filter(({ value }) => value === form.values.oamRole)[0]
    ?.label;
  const omsRoleData = roleOptionsTranslator(
    accessControl.getAssignableOmsRoles(
      form.values.oamRole as OAMRole,
      userInfo?.omsRole,
      !!userInfo && !!account.id && userInfo.id === account.id,
    ),
  );
  const disabledOMSRole = userInfo
    ? accessControl.isItemOmsRoleDisabled(userInfo) ||
      omsRoleData.filter((role) => !role.disabled).length < 2
    : true;
  const disabledOMSRoleLabel = OmsRole.filter(({ value }) => value === form.values?.omsRole)[0]
    ?.label;
  const disabledOssRole = true; // !(userInfo?.canEdit && userInfo?.emailConfirm);
  const oamRoleData = roleOptionsTranslator(
    accessControl.getAssignableOamRoles(userInfo?.oamRole),
  ).reverse();
  const ossRoleData = roleOptionsTranslator(OssRole);

  const { askTransferOwner, maybeAskTransfer } = useUserDataTransfer();
  const dispatch = useDispatch();
  const [userCheckResult, setUserCheckResult] = useState<PackageStatusCheckResult>({
    count: 0,
    limit: 0,
    status: PackageStatus.Normal,
  });

  useEffect(() => {
    let userStatus: PackageStatus;
    if (oms.userLimit === -1) {
      userStatus = PackageStatus.Expired;
    } else if (omsUsersCount > oms.userLimit) {
      userStatus = PackageStatus.ExceededLimit;
    } else {
      userStatus = PackageStatus.Normal;
    }

    setUserCheckResult({
      count: omsUsersCount,
      limit: oms.userLimit,
      status: userStatus,
    });
  }, [omsUsersCount, oms.userLimit]);

  const isErrorAlert =
    userCheckResult.status === PackageStatus.ExceededLimit && form.values.omsRole !== 'undefined';

  const doSubmit = async (keepRoles: boolean, transferToId?: string) => {
    try {
      const formData = {
        id: userInfo!.id,
        name: form.values.name,
        language: form.values.language,
        nfc01: form.values.nfc01,
        nfc02: form.values.nfc02,
        note: form.values.note,
        oamRole: keepRoles ? userInfo!.oamRole : form.values.oamRole,
        omsRole: keepRoles ? userInfo!.omsRole : form.values.omsRole,
        ossRole: keepRoles ? userInfo!.ossRole : form.values.ossRole,
      };

      const res = await updateOrganizationUser(formData);
      if ('error' in res) {
        return { message: getErrorMessage(res.error) || 'unknown error' };
      }

      // procceed if transfer is needed
      if (!transferToId) {
        return null;
      }
      const response = await updateMultiOrganizationUserRoles([
        {
          id: userInfo!.id,
          oamRole: form.values.oamRole,
          omsRole: form.values.omsRole,
          ossRole: form.values.ossRole,
          email: userInfo!.email,
          transferToId,
        },
      ]);
      if ('error' in response) {
        return { message: getErrorMessage(response.error) || 'transfer error' };
      }
      return null;
    } catch (error) {
      console.log(error);
    }
    return { message: 'unknown error' };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.validate().hasErrors) {
      return;
    }
    const isSelf = account.id === userInfo!.id;
    if (!isSelf && form.values.oamRole === Role.OAM_ROLE_OWNER) {
      askTransferOwner(
        userInfo!.id,
        form.values.name,
        account.id,
        accessControl.getOldOwnerNewOmsRole(userInfo!.omsRole as OMSRole),
        () => doSubmit(true),
      );
      return;
    }

    const { proceed, transferToId } = await maybeAskTransfer(
      [userInfo!],
      [{ omsRole: form.values.omsRole as OMSRole }],
    );
    if (!proceed) {
      return;
    }

    const error = await doSubmit(!!transferToId, transferToId);
    if (!error) {
      const selfRoleChanged =
        isSelf &&
        (form.values.oamRole !== userInfo!.oamRole ||
          form.values.omsRole !== userInfo!.omsRole ||
          form.values.ossRole !== userInfo!.ossRole);
      if (selfRoleChanged) {
        message.open({
          tit: t('Access_expired'),
          msg: t('Access_expired_content'),
          rightBtn: t('Ok'),
          rightBtnClick: () => {
            dispatch(clearAuthInfo());
          },
        });
      } else {
        router.push('/users');
      }
      oamNotifications.show({
        title: t('Change_saved'),
      });
    } else {
      oamNotifications.show({
        title: `${error.message}`,
      });
    }
  };

  useEffect(() => {
    const isComplete = Boolean(form.values.name && form.values.email);
    setIsCompleted(isComplete);
  }, [form.values]);

  useEffect(() => {
    getOrganizationUserCount();
  }, [form.values.omsRole]);

  async function fetchOrganizationUser(query: { accountId: string }) {
    try {
      await getOrganizationUser(query)
        .unwrap()
        .then((res: { data: IUsers }) => {
          if (res) {
            const uInfo = res.data;

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
        });
    } catch (e: any) {
      if (e.status === 400 && e.data.message) {
        router.replace({ pathname: '/' });
      }
    }
  }

  useEffect(() => {
    const { id: accountId } = router.query;
    if (typeof accountId === 'string') {
      fetchOrganizationUser({ accountId });
    }
  }, [router.query]);

  const fetchUserResendInvitation = async (email: string) => {
    const id = 'send-email';
    try {
      const result = await oamNotificationsShowUntil(
        {
          id,
          title: t('Sending_email'),
        },
        {
          waitFn: sendOrganizationsUserInvitation,
          params: [{ email }],
        },
        {
          title: t('Sending_email'),
        },
      );
    } catch (error: any) {
      message.open({
        tit: t('Error'),
        msg: error.response.data.errorMessage,
        rightBtn: t('Ok'),
        rightBtnClick: () => {},
      });
      console.error(error);
    }
  };

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
                placeholder="Name"
                onBlurCapture={() => form.validate()}
                {...form.getInputProps('name')}
              />
              <OAMTextInput
                label={t('Email')}
                required
                disabled
                error={form.errors.email && t('Invalid_email')}
                onBlurCapture={() => form.validate()}
                {...form.getInputProps('email')}
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
              required
              placeholder={disabledOAMRoleLabel}
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={oamRoleData}
              disabled={disabledOAMRole}
              {...form.getInputProps('oamRole')}
              onChange={(x) => {
                form.getInputProps('oamRole').onChange(x);
                form.setFieldValue(
                  'omsRole',
                  accessControl.getPreviewAutoOmsRole(x as OAMRole, userInfo!.omsRole),
                );
              }}
            />
          </div>
          <div className={classes.roleRWD}>
            <Text color="#415284" pb="xs">
              {t('OMS_role')}
            </Text>
            <OAMSelect
              required
              placeholder={disabledOMSRoleLabel}
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={omsRoleData}
              disabled={disabledOMSRole}
              errorAlert={!disabledOMSRole && isErrorAlert}
              {...form.getInputProps('omsRole')}
            />
          </div>
          <div className={classes.roleRWD}>
            <Text color="#415284" pb="xs">
              {t('OSS_role')}
            </Text>
            <OAMSelect
              required
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={ossRoleData}
              disabled={disabledOssRole}
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
          disabled={!isCompleted || isErrorAlert}
        >
          {updateStatus.isLoading ? <Loader size="sm" color="gray" /> : t('Save')}
        </OAMButton>
      </div>
    </form>
  );

  const layout = (
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
                  disabled
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
              required
              placeholder={disabledOAMRoleLabel}
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={oamRoleData}
              disabled={disabledOAMRole}
              {...form.getInputProps('oamRole')}
              onChange={(x) => {
                form.getInputProps('oamRole').onChange(x);
                form.setFieldValue(
                  'omsRole',
                  accessControl.getPreviewAutoOmsRole(x as OAMRole, userInfo!.omsRole),
                );
              }}
            />
          </div>
          <div>
            <Text color="#415284" pb="xs">
              {t('OMS_role')}
            </Text>
            <OAMSelect
              required
              placeholder={disabledOMSRoleLabel}
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              data={omsRoleData}
              disabled={disabledOMSRole}
              errorAlert={!disabledOMSRole && isErrorAlert}
              {...form.getInputProps('omsRole')}
            />
          </div>
          <div>
            <Text color="#415284" pb="xs">
              {t('OSS_role')}
            </Text>
            <OAMSelect
              required
              placeholder="Free"
              rightSection={<IconChevronDown size="1rem" />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              disabled={disabledOssRole}
              data={ossRoleData}
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
          disabled={!isCompleted || isErrorAlert}
        >
          {updateStatus.isLoading || updateMultiRoleStatus.isLoading ? (
            <Loader size="sm" color="gray" />
          ) : (
            t('Save')
          )}
        </OAMButton>
      </div>
    </form>
  );

  return (
    <>
      <Container fluid px="lg" pb={60}>
        <Breadcrumbs start={1} end={3} />
        <Card.Section className={classes.title}>
          <Text>{t('Edit_user')}</Text>
        </Card.Section>
        {userInfo && !userInfo?.emailConfirm && (
          <div className={classes.resend}>
            <Text>{t('Account_unverified_any_changes_will_be_applied')}</Text>
            <OAMButton
              customType={OAMButtonType.LIGHT_OUTLINE}
              disabled={!form.values.email}
              onClick={() => fetchUserResendInvitation(form.values.email)}
            >
              {t('Resend_verification')}
            </OAMButton>
          </div>
        )}
        {isMobile ? mobileLayout : layout}
      </Container>
    </>
  );
}

export default EditUser;

EditUser.requireAuth = true;
