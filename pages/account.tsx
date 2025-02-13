import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Text, createStyles, Divider, rem, Avatar, Switch } from '@mantine/core';
import { useRouter } from 'next/router';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IconChevronDown } from '@tabler/icons-react';
import OAMAnchor from '../components/base/Anchor';
import OAMDialog, { OAMDialogType } from '../components/dialog';
import { useSelector, useDispatch } from '../store';
import { SUPPORTED_LANGUAGES } from '../i18n/i81nTypes';
import { timeFormatOptions } from '../utils/date';
import OAMSelect, { OAMSelectType } from '../components/base/Select';
import OAMTextInput from '../components/base/TextInput';
import { usePopup } from '../providers/popupProvider';
import { selectAccount, selectOrganization } from '../store/slices';
import {
  useUpdateUserMutation,
  useUpdateOrganizationMutation,
  useAccountDeleteMutation,
  useLazyGetOrganizationUserQuery,
} from '../store/services';
import type { UserPayload } from '../store/services';
import { OrganizationType, PairType } from '../utils/types';
import useCloudPair from '../hooks/useCloudPair';
import { OAMRole, Role } from '../utils/role';
import { useJWTContext } from '../providers/jwtProvider';
import { timeZoneOptions } from '../utils/timezone';
import { getOrganizationLocation, getLocation } from '../utils/location';
import useValidator from '../hooks/useValidator';
import { TYPE_DATA } from '../utils/constant';
import useUserDataTransfer from '../hooks/useUserDataTransfer';
import { clearAuthInfo } from '../store/actions';
import { useLanguageContext } from '../providers/languageProvider';
import { FullPagePrompt, SimpleMessagePagePrompt } from '../components/FullPagePrompt';

const useStyles = createStyles((theme) => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    background: '#F2F2F2',
    padding: '50px 16px 16px 16px',
    [theme.fn.smallerThan('768')]: {
      padding: 0,
      width: '100%',
    },
  },
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    background: 'white',
    padding: '3.75% 0px',
    paddingLeft: '3.75%',
    width: '71.3%',
    [theme.fn.smallerThan('1365')]: {
      width: '87%',
    },
    [theme.fn.smallerThan('768')]: {
      width: 'inherit',
      padding: 20,
      flexDirection: 'column',
    },
  },
  form: {
    margin: '0 50px',
    flex: 1,
    [theme.fn.smallerThan('768')]: {
      width: 'inherit',
      alignItems: 'center',
      margin: 0,
    },
  },

  div: {
    [theme.fn.smallerThan('768')]: {
      width: 'inherit',
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },

  title: {
    marginTop: 0,
    marginBottom: rem(20),
    fontSize: '14px',
    color: '#444444',
    fontWeight: 500,
  },

  inline: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexBasis: 'calc(50% - 15px)',
      marginBottom: '12px',
      maxWidth: 'calc(50% - 15px)',
    },
    '& > *:nth-of-type(odd)': {
      marginRight: '30px',
    },
    [theme.fn.smallerThan('768')]: {
      flexDirection: 'column',
      '& > *': {
        flexBasis: '100%',
        maxWidth: '100%',
        marginRight: 0,
        width: '100%',
      },
      '& > *:nth-of-type(odd)': {
        marginRight: 0,
      },
    },
  },
  input: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
    flexBasis: '50%',
  },

  dialogSelect: {
    marginBottom: theme.spacing.sm,
    flexBasis: '50%',
  },

  inputNoBorder: {
    position: 'relative',
    padding: 0,
    color: 'black',
    marginBottom: theme.spacing.sm,
    flexBasis: '50%',
    input: {
      borderStyle: 'none',
      padding: 0,
      color: '#444444',
    },
    '& :not([data-disabled]):hover': {
      border: 0,
    },
    '& :focus': {
      border: 0,
    },
  },
  inputInline: {
    flex: 1,
    marginBottom: 0,
    '.mantine-TextInput-wrapper': {
      marginBottom: 0,
    },
    '.mantine-TextInput-root': {
      marginRight: 0,
    },
  },
  linkButton: {
    color: 'dimmed',
    fontSize: '14px',
    position: 'absolute',
    right: '8px',
    top: '48%',
    transform: 'center',
    borderStyle: 'none',
  },

  //should exist for layout
  NOdisplay: {
    flexBasis: '50%',
  },

  delButton: {
    fontSize: '14px',
    fontWeight: 400,
    color: 'red',
    right: '8px',
    top: '55%',
    transform: 'center',
    textAlign: 'start',
  },

  row: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    marginBottom: rem(30),
  },
  text: {
    fontSize: '14px',
    fontWeight: 400,
  },
}));

function UserAccount() {
  const router = useRouter();
  const [pairOpened, { open, close }] = useDisclosure(false);
  const [pairType, setPairType] = useState(PairType.GoogleDrive);
  const [statusOpened, { open: openStatus, close: closeStatus }] = useDisclosure(false);
  const { validateUsername } = useValidator();
  const { t } = useTranslation();
  const { classes, cx } = useStyles();
  const { cloud, pair, unpair, pairEmail } = useCloudPair();
  const { changePassword: changePasswordPopup, changeLocation: changeLocationPopup } = usePopup();
  const [updateUser] = useUpdateUserMutation();
  const [updateOrganization] = useUpdateOrganizationMutation();
  const { oamRole, accountId } = useJWTContext();
  const { loadingPopup } = usePopup();
  const dispatch = useDispatch();
  const { language: currentLanguage, changeLanguage } = useLanguageContext();
  const [accountDeletedUI, setAccountDeletedUI] = useState(false);

  const ErrorMessageMap = {
    GOOGLE_ACCOUNT_CONFLICT: t('Google_account_conflict'),
    PERMISSION_DENIED: t('Permission_denied'),
  };

  const [errorTitle, setErrorTitle] = useState('');

  useEffect(() => {
    if (router.query?.deleteAccount) router.replace('/account#deleteAccount');
  }, [router]);

  useEffect(() => {
    //?status=failed&message=GOOGLE_ACCOUNT_CONFLICT
    if (router.isReady && router.query?.status === 'failed') {
      setErrorTitle(ErrorMessageMap?.[router.query.message as keyof typeof ErrorMessageMap]);
      openStatus();
    }
  }, [router.query]);

  const account =
    useSelector<{
      name: string;
      email: string;
      language: string;
      timezone: string;
      formatDate: string;
      sso: string;
      isAutoLogout: boolean;
      deviceGoogleAccount: string;
    }>(selectAccount);
  const organization =
    useSelector<{
      name: string;
      type: string;
      address: string;
      city: string;
      country: string;
      state: string;
      othersName?: string;
    }>(selectOrganization);

  function getFormValues(...props: [typeof account, typeof organization, string]) {
    return {
      name: props[0].name || '',
      email: props[0].email || '',
      language: SUPPORTED_LANGUAGES.some((lang) => lang.value === props[2]) ? props[2] : 'en', // TODO detected language
      timezone: props[0].timezone || '',
      formatDate: props[0].formatDate || 'DD/MM/YYYY',
      organization: props[1].name || '',
      type: props[1].type || '',
      location: getLocation(props[1]) || '',
      city: props[1].city || '',
      country: props[1].country || '',
      state: props[1].state || '',
      address: props[1].address || '',
      othersName: props[1].othersName || 'Others',
      // TODO GoogleDrive, Google Classroom, Microsoft Onedrive
      isAutoLogout: props[0].isAutoLogout || false,
      deviceGoogleAccount: props[0].deviceGoogleAccount || '',
    };
  }

  const [deleteUser, status] = useAccountDeleteMutation();

  const fetchUserDel = async (transferToId?: string) => {
    loadingPopup.open();
    const deleteResponse = await (transferToId !== undefined
      ? deleteUser({ transferToId })
      : deleteUser());
    loadingPopup.close();
    !('error' in deleteResponse) && setAccountDeletedUI(true);
  };

  const pairStatus = (type: PairType) => (pairEmail(type) ? t('Unpair') : t('Pair'));

  const handlePairButtonClick = async (type: PairType) => {
    if (pairEmail(type)) {
      setPairType(type);
      open();
    } else {
      pair(type);
    }
  };
  // const checkEmail = () => {
  //   if (isEmail(account.email)) {
  //     fetchUserDel(account.email);
  //   } else {
  //     message.open({
  //       tit: t('Error'),
  //       msg: t('Email_not_correct'),
  //       rightBtn: t('Ok') as string,
  //       rightBtnClick: () => {},
  //     });
  //   }
  // };

  const [getOrganizationUser, getOrganizationUserStatus] = useLazyGetOrganizationUserQuery();
  useEffect(() => {
    getOrganizationUser({ accountId });
  }, [accountId]);

  const { askDeleteSelf } = useUserDataTransfer();

  const handelOwnerDeletePopup = async () => {
    if (oamRole === Role.OAM_ROLE_USER) {
      const { proceed } = await askDeleteSelf(oamRole as OAMRole);
      proceed && fetchUserDel();
      return;
    }
    const omsRole = getOrganizationUserStatus.data?.data.omsRole;
    const userId = getOrganizationUserStatus.data?.data.id;
    if (!omsRole || !userId) {
      console.error('failed to getOrganizationUser');
      return;
    }
    const response = await askDeleteSelf(oamRole as OAMRole, omsRole, userId);
    if (!response.proceed) {
      return;
    }
    fetchUserDel(response.transferToId);
  };

  const handelChangePasswordPopup = () => {
    changePasswordPopup.open({
      result: () => dispatch(clearAuthInfo()),
    });
  };

  const validateOthersName = useCallback(
    (value: string, values: Record<string, string>) => {
      if (values.type === OrganizationType.Others) {
        return validateUsername(value);
      }
      return null;
    },
    [validateUsername],
  );

  const form = useForm<Record<string, any>>({
    initialValues: getFormValues(account, organization, currentLanguage),
    validate: {
      name: validateUsername,
      organization: validateUsername,
      othersName: validateUsername,
      language: isNotEmpty(),
      deviceGoogleAccount: (value) => {
        if (value.trim() === '') {
          return null; // pass validation when empty string
        }
        return isEmail(t('Invalid_email'))(value);
      },
    },
  });

  const organizationLocation = {
    country: form.values.country,
    state: form.values.state,
    city: form.values.city,
    address: form.values.address,
  };
  const handelChangeLocationPopup = () => {
    changeLocationPopup.open({ form });
  };

  useEffect(() => {
    form.setValues(getFormValues(account, organization, currentLanguage));
  }, [account, organization, currentLanguage]);

  const avatarText = (account.name as string).toUpperCase().slice(0, 1);

  function handleUpdateUser(field?: keyof typeof form.values, newValue?: string) {
    if (form.validate().hasErrors) return;
    if (field) form.getInputProps(field).onBlur();
    const userPayload: Record<string, string | boolean> = {
      name: form.values.name,
      avatar: '', // TODO
      language: form.values.language,
      timezone: form.values.timezone,
      formatDate: form.values.formatDate,
      isAutoLogout: form.values.isAutoLogout,
      deviceGoogleAccount: form.values.deviceGoogleAccount,
    };
    field && newValue !== undefined && (userPayload[field] = newValue);
    updateUser(userPayload as UserPayload);
  }

  const readonlyDeviceGoogleAccount = account.deviceGoogleAccount;
  const [relatedGoogleAccountModalOpened, relatedGoogleAccountModalHandler] = useDisclosure(false);
  const [deleteGoogleAccountModalOpened, deleteGoogleAccountModalHandler] = useDisclosure(false);

  async function handleUpdateOrgLoc() {
    if (
      form.isDirty('country') ||
      form.isDirty('state') ||
      form.isDirty('city') ||
      form.isDirty('address')
    ) {
      const result = await updateOrganization({
        updateTarget: 2,
        ...organizationLocation,
      }).unwrap();

      if (result.data) {
        form.resetDirty();
      } else {
        form.setErrors({
          organization: ' ',
          type: ' ',
          othersName: ' ',
        });
      }
    }
  }

  function handleSubmit() {
    handleUpdateUser();
    handleUpdateOrgLoc();
  }

  const handleOrganizationBlur = async (
    event: React.FocusEvent<HTMLInputElement>,
    field: string,
  ) => {
    if (form.validate().hasErrors) return;
    const updateValue = event.target.value;

    const updateOrganizationData = {
      updateTarget: 1,
      organization: form.values.organization,
      type: form.values.type,
      ...(form.values.type === OrganizationType.Others
        ? { othersName: form.values.othersName }
        : {}),
    };

    if (field === 'organizationName') {
      updateOrganizationData.organization = updateValue;
    } else if (field === 'othersName') {
      updateOrganizationData.othersName = updateValue;
    }

    await updateOrganization(updateOrganizationData).unwrap();
  };

  const handleOrganizationTypeOnchange = async (value: any) => {
    if (form.validate().hasErrors) return;
    if (value === null) {
      return;
    }
    await updateOrganization({
      updateTarget: 1,
      organization: form.values.organization,
      type: value,
      ...(value === OrganizationType.Others ? { othersName: form.values.othersName } : {}),
    }).unwrap();
  };

  const unpairTitleMaps = {
    [PairType.GoogleDrive]: pairEmail(PairType.GoogleClassroom)
      ? t('Unpairing_google_drive_also_unpairs_google_classroom')
      : t('Unpair_google_drive'),
    [PairType.GoogleClassroom]: t('Unpairing_oogle_classroom_also_unpairs_google_drive'),
    [PairType.OneDrive]: t('Unpair_microsoft_one_drive'),
  };

  const { onChange: onChangeLanguageInput, ...restLanguageInputProps } =
    form.getInputProps('language');

  if (accountDeletedUI) {
    return (
      <FullPagePrompt withLanguage>
        <SimpleMessagePagePrompt
          title={t('Account_deleted')}
          someText={t('Account_deleted_content')}
          buttonText={t('Back_to_login')}
          onClick={() => dispatch(clearAuthInfo())}
        />
      </FullPagePrompt>
    );
  }

  const typeData = useMemo(
    () =>
      TYPE_DATA.map((item) => ({
        label: t(item.namespace),
        value: item.key,
      })),
    [TYPE_DATA],
  );

  return (
    <div className={classes.main}>
      {/* whole card */}
      <div className={classes.container}>
        <Avatar
          alt={avatarText}
          styles={(theme) => ({
            placeholder: {
              textAlign: 'center',
              fontSize: '64px',
              borderRadius: '50%',
              fontWeight: 500,
              background: '#465EE3',
              color: '#FFF',
              [theme.fn.smallerThan('768')]: {
                borderRadius: '50%',
              },
            },
            root: {
              width: rem(120),
              height: rem(120),
              [theme.fn.smallerThan('768')]: {
                margin: `${rem(30)} 0`,
                width: rem(100),
                height: rem(100),
              },
            },
          })}
        >
          {avatarText}
        </Avatar>
        {/* Inputs */}
        <form className={classes.form} onSubmit={form.onSubmit(() => handleSubmit())}>
          <div className={classes.div}>
            <Text className={classes.title}>{t('General')}</Text>
            <div className={classes.inline}>
              <OAMTextInput
                key="UserName"
                label={t('Username')}
                className={classes.input}
                placeholder={t('Only_alphabets_allowed') as string}
                {...form.getInputProps('name')}
                onBlur={() => handleUpdateUser('name')}
              />

              <OAMTextInput
                key="Email"
                label={t('Email')}
                className={classes.input}
                disabled
                type="email"
                {...form.getInputProps('email')}
              />
            </div>

            <div className={classes.inline}>
              <OAMSelect
                className={classes.input}
                data={SUPPORTED_LANGUAGES}
                id="Language"
                label={t('Language')}
                {...restLanguageInputProps}
                onChange={(value) => {
                  onChangeLanguageInput(value);
                  handleUpdateUser('language', value as string);
                  changeLanguage(value as string);
                }}
              />
              <OAMSelect
                searchable
                className={classes.input}
                data={timeZoneOptions}
                id="Timezone"
                label={t('Timezone')}
                {...form.getInputProps('timezone')}
                onBlur={() => handleUpdateUser('timezone')}
              />
            </div>
            <div className={classes.inline}>
              <OAMSelect
                className={classes.input}
                data={timeFormatOptions}
                id="FormatDate"
                label={t('Date_format')}
                {...form.getInputProps('formatDate')}
                onBlur={() => handleUpdateUser('formatDate')}
              />
            </div>

            {!account.sso && (
              <div key="Password" className={classes.row}>
                <Text className={classes.text}>{t('Password')}</Text>

                <OAMAnchor
                  component="button"
                  type="button"
                  className={classes.text}
                  onClick={handelChangePasswordPopup}
                >
                  {t('Change')}
                </OAMAnchor>
              </div>
            )}
          </div>
          <Divider />
          <div>
            <Text fw={500} fz="sm" mb="md" mt="xl">
              {t('Device_google_account')}
            </Text>

            <div className={classes.row}>
              <div>
                <Text c="#415284" fz="sm" mb="xs">
                  {t('Auto_logout_device_google_account')}
                </Text>
                <Text c="#444444" fz="sm" fw={400}>
                  {t('Auto_logout_device_google_account_Desc')}
                </Text>
              </div>
              <Switch
                size="sm"
                color="lime.7"
                checked={form.values.isAutoLogout}
                onChange={(event) => {
                  form.setFieldValue('isAutoLogout', event.currentTarget.checked);
                  updateUser({
                    name: form.values.name,
                    avatar: '', // TODO
                    language: form.values.language,
                    timezone: form.values.timezone,
                    formatDate: form.values.formatDate,
                    isAutoLogout: event.currentTarget.checked,
                    deviceGoogleAccount: form.values.deviceGoogleAccount,
                  });
                }}
              />
            </div>
            {form.values.isAutoLogout && (
              <div className={classes.row}>
                <OAMTextInput
                  label={t('Related_google_account')}
                  className={cx(classes.inputNoBorder, classes.inputInline)}
                  value={readonlyDeviceGoogleAccount || '--'}
                  readOnly
                />
                <OAMAnchor
                  component="button"
                  type="button"
                  className={classes.text}
                  onClick={() => relatedGoogleAccountModalHandler.open()}
                >
                  {t('Edit')}
                </OAMAnchor>
                {readonlyDeviceGoogleAccount && (
                  <OAMAnchor
                    component="button"
                    type="button"
                    ml="md"
                    className={classes.text}
                    onClick={() => deleteGoogleAccountModalHandler.open()}
                  >
                    {t('Delete')}
                  </OAMAnchor>
                )}
              </div>
            )}
          </div>
          {/* divider 1 */}
          <Divider my="sm" />
          <div>
            <div className={classes.inline}>
              <Text className={classes.title} mt={18}>
                {t('Organization')}
              </Text>
            </div>
            <div className={classes.inline}>
              <OAMTextInput
                key="OrganizationName"
                required
                label={t('Organization_name')}
                className={classes.input}
                disabled={oamRole !== Role.OAM_ROLE_OWNER}
                {...form.getInputProps('organization')}
                onBlur={(event) => handleOrganizationBlur(event, 'organizationName')}
              />
              <OAMSelect
                key="OrganizationType"
                required
                customType={OAMSelectType.BORDER}
                radius="md"
                label={t('Organization_type')}
                rightSection={<IconChevronDown size="1rem" />}
                dropdownPosition="bottom"
                data={typeData}
                disabled={oamRole !== Role.OAM_ROLE_OWNER}
                {...form.getInputProps('type')}
                onChange={(value) => handleOrganizationTypeOnchange(value)}
              />
            </div>
            {form.values.type === OrganizationType.Others && (
              <div className={classes.inline}>
                <OAMTextInput
                  required
                  key="Others"
                  label={t('Others')}
                  className={classes.input}
                  disabled={oamRole !== Role.OAM_ROLE_OWNER}
                  {...form.getInputProps('othersName')}
                  onBlur={(event) => handleOrganizationBlur(event, 'othersName')}
                />
                <div style={{ flexBasis: '50%' }} />
              </div>
            )}
            <div className={classes.row}>
              <OAMTextInput
                key="OrganizationLocation"
                label={t('Organization_location')}
                className={cx(classes.inputNoBorder, classes.inputInline)}
                readOnly
                value={getOrganizationLocation(organizationLocation)}
              />
              {oamRole === Role.OAM_ROLE_OWNER && (
                <OAMAnchor
                  component="button"
                  type="button"
                  className={classes.text}
                  onClick={oamRole === 'owner' ? handelChangeLocationPopup : undefined}
                >
                  {t('Change')}
                </OAMAnchor>
              )}
            </div>
          </div>
          <Divider my="sm" />
          <div>
            <Text className={classes.title} mt={30}>
              {t('Cloud_integration')}
            </Text>
            <div className={classes.inline}>
              <div className={classes.input}>
                <OAMTextInput
                  className={classes.inputNoBorder}
                  key="GoogleDrive"
                  label={t('Google_drive')}
                  value={cloud[PairType.GoogleDrive] || '--'}
                  readOnly
                />
                <OAMAnchor
                  component="button"
                  type="button"
                  className={classes.linkButton}
                  onClick={() => handlePairButtonClick(PairType.GoogleDrive)}
                >
                  {pairStatus(PairType.GoogleDrive)}
                </OAMAnchor>
              </div>
              <div className={classes.input}>
                <OAMTextInput
                  className={classes.inputNoBorder}
                  key="GoogleClassroom"
                  label={t('Google_classroom')}
                  value={cloud[PairType.GoogleClassroom] || '--'}
                  readOnly
                />
                <OAMAnchor
                  component="button"
                  type="button"
                  className={classes.linkButton}
                  onClick={() => handlePairButtonClick(PairType.GoogleClassroom)}
                >
                  {pairStatus(PairType.GoogleClassroom)}
                </OAMAnchor>
              </div>
            </div>
            <div className={classes.inline}>
              <div className={classes.input}>
                <OAMTextInput
                  className={classes.inputNoBorder}
                  key="MicrosoftOnedrive"
                  label={t('Microsoft_one_drive')}
                  value={cloud[PairType.OneDrive] || '--'}
                  readOnly
                />
                {/* TODO:unpair/pair status */}
                <OAMAnchor
                  component="button"
                  type="button"
                  className={classes.linkButton}
                  onClick={() => handlePairButtonClick(PairType.OneDrive)}
                >
                  {pairStatus(PairType.OneDrive)}
                </OAMAnchor>
              </div>
              <div className={classes.input}>
                <div className={classes.NOdisplay} />
              </div>
            </div>
          </div>

          {/* divider 2 */}
          <Divider my="sm" />
          <div id="deleteAccount" className={classes.inline}>
            {!getOrganizationUserStatus.isFetching && (
              <OAMAnchor
                mt={20}
                mb={20}
                component="button"
                type="button"
                className={classes.delButton}
                onClick={handelOwnerDeletePopup}
              >
                {t('Delete_account')}
              </OAMAnchor>
            )}
          </div>
        </form>
        <OAMDialog
          customType={OAMDialogType.MESSAGE}
          opened={pairOpened}
          onClose={close}
          title={unpairTitleMaps[pairType]}
          leftButton={t('Cancel')}
          rightButton={t('Unpair')}
          onLeftClick={close}
          onRightClick={() => {
            unpair(pairType);
            close();
          }}
        />
        <OAMDialog
          customType={OAMDialogType.MESSAGE}
          opened={statusOpened}
          onClose={closeStatus}
          title={errorTitle}
          rightButton={t('Ok')}
          onRightClick={() => {
            closeStatus();
            const { status, message, ...query } = router.query;
            router.replace({ pathname: '/account', query });
          }}
        />

        <OAMDialog
          customType={OAMDialogType.FORM}
          opened={relatedGoogleAccountModalOpened}
          onClose={relatedGoogleAccountModalHandler.close}
          title={t('Related_google_account')}
          leftButton={t('Cancel')}
          rightButton={t('Ok')}
          onLeftClick={() => {
            relatedGoogleAccountModalHandler.close();
            form.setFieldValue('deviceGoogleAccount', readonlyDeviceGoogleAccount);
            form.clearErrors();
          }}
          formSubmit={form.onSubmit(() => {
            handleUpdateUser('deviceGoogleAccount');
            relatedGoogleAccountModalHandler.close();
          })}
        >
          <OAMTextInput
            key="OrganizationName"
            className={classes.input}
            {...form.getInputProps('deviceGoogleAccount')}
          />
        </OAMDialog>

        <OAMDialog
          customType={OAMDialogType.MESSAGE}
          opened={deleteGoogleAccountModalOpened}
          onClose={deleteGoogleAccountModalHandler.close}
          title={t('Delete_google_account')}
          leftButton={t('Cancel')}
          rightButton={t('Delete')}
          onLeftClick={deleteGoogleAccountModalHandler.close}
          onRightClick={() => {
            form.setFieldValue('deviceGoogleAccount', '');
            updateUser({
              name: form.values.name,
              avatar: '', // TODO
              language: form.values.language,
              timezone: form.values.timezone,
              formatDate: form.values.formatDate,
              isAutoLogout: form.values.isAutoLogout,
              deviceGoogleAccount: '',
            });
            deleteGoogleAccountModalHandler.close();
          }}
        />
      </div>
    </div>
  );
}

export default UserAccount;

UserAccount.requireAuth = true;
