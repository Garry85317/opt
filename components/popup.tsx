import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Modal,
  PasswordInput,
  rem,
  Text,
  LoadingOverlay,
  Paper,
  Checkbox,
  Flex,
  Anchor,
  createStyles,
  SelectItem,
} from '@mantine/core';
import { DefaultTFuncReturn } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from '@mantine/hooks';
import {
  isNotEmpty,
  isEmail,
  hasLength,
  matches,
  matchesField,
  useForm,
  UseFormReturnType,
} from '@mantine/form';
import { PASSWORD_REGEX } from '../utils/constant';
import TextInput from './base/TextInput';
import Select from './base/Select';
import Dialog, { OAMDialogType } from './dialog';
import {
  OrganizationPayload,
  useUpdateOrganizationMutation,
  useChangePasswordMutation,
  useLazyGetTransferrableOrganizationUsersQuery,
} from '../store/services';
import { useSelector } from '../store';
import { selectAccount } from '../store/slices';
import { Validator, chainValidator } from '../utils/validator';
import { LocationInput } from './input/Location';
import { StateInput } from './input/State';
import { PasswordHideIcon as Hide, PasswordShowIcon as Show } from './base/icon';
import { oamNotifications, oamNotificationsShowUntil } from './base/Notifications';
import { CustomLoader, LOADING_TEXT_WIDTH } from './customLoader';

export interface Open {
  tit?: DefaultTFuncReturn;
  msg?: DefaultTFuncReturn | JSX.Element;
  input?: typeof React.Component;
  form?: UseFormReturnType<Record<string, any>>;
  submit?: () => void;
  email?: string;
  rightBtnDisable?: boolean;
  rightBtn?: DefaultTFuncReturn;
  rightBtnClick?: (x?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  leftBtn?: DefaultTFuncReturn;
  leftBtnClick?: () => void;
  result?: (password: string) => void;
  cancel?: () => void;
  okClick?: (...args: any[]) => void;
  candidateBlacklist?: Set<string>;
}

// function notMatchesField(field: string, error?: React.ReactNode) {
//   const _error = error || true;

//   return (value: unknown, values: Record<string, unknown>) => {
//     if (!values || !(field in values)) {
//       return _error;
//     }

//     return value !== values[field] ? null : _error;
//   };
// }

function useChainValidator() {
  const { t } = useTranslation();
  const checkLength = hasLength(
    { min: 10, max: 128 },
    t('Password_must_be_10_128_characters_long'),
  );
  const checkUppercase = matches(
    /(?=.*[A-Z])/,
    t('Password_must_have_at_least_one_uppercase_letter'),
  );
  const checkLowercase = matches(
    /(?=.*[a-z])/,
    t('Password_must_have_at_least_one_lowercase_letter'),
  );
  const checkNumber = matches(/(?=.*\d)/, t('Password_must_have_at_least_one_number'));
  const checkSpecial = matches(
    // eslint-disable-next-line no-useless-escape
    /(?=.*[\!\@\#\$\%\^\&\*\(\)\-\=\¡\£\_\+\`\~\.\,\<\>\/\?\;\:\'\"\\\|\[\]\{\}])/,
    t('Password_must_have_at_least_one_special_character'),
  );
  const passwordValidator = chainValidator(
    isNotEmpty(t('Password_do_not_empty')),
    chainValidator(
      checkLength,
      chainValidator(
        checkUppercase,
        chainValidator(checkLowercase, chainValidator(checkNumber, checkSpecial)),
      ),
    ),
  );
  const newPasswordValidator = chainValidator(
    ((value: string, values: { oldPassword: string }) =>
      value === values.oldPassword
        ? t('New_password_is_the_same_as_old_password')
        : null) as Validator,
    chainValidator(
      isNotEmpty(t('Password_do_not_empty')),
      chainValidator(
        checkLength,
        chainValidator(
          checkUppercase,
          chainValidator(checkLowercase, chainValidator(checkNumber, checkSpecial)),
        ),
      ),
    ),
  );
  return {
    passwordValidator,
    newPasswordValidator,
  };
}

const useStyles = createStyles((theme) => ({
  checkbox: {
    [theme.fn.smallerThan('768')]: {
      justifyContent: 'center',
    },
  },
  anchor: {
    [theme.fn.smallerThan('768')]: {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      bottom: '100px',
      flexWrap: 'wrap',
    },
    [theme.fn.smallerThan('660')]: {
      position: 'relative',
      left: '3%',
      width: ' 95%',
    },
  },
}));

const LOADER_PADDING_X = 20;

export const useLoadingPopup = () => {
  const [openedPopup, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  const onOpen = () => {
    close();
    open();
  };

  const body = useMemo(
    () => (
      <Modal
        opened={openedPopup}
        onClose={close}
        centered
        closeOnEscape={false}
        closeOnClickOutside={false}
        withCloseButton={false}
        styles={{ body: { padding: `${rem(32)} ${rem(LOADER_PADDING_X)}` } }}
        size={rem(LOADER_PADDING_X * 2 + LOADING_TEXT_WIDTH)}
      >
        <CustomLoader loadingText={t('Loading')} />
      </Modal>
    ),
    [openedPopup, t],
  );
  return {
    body,
    open: onOpen,
    close,
  };
};

export const ReEnterEmailPopup = ({
  opened,
  onCancel,
  onSubmit,
}: {
  opened: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  const { t } = useTranslation();
  const account = useSelector(selectAccount);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value: string) =>
        value.toLocaleLowerCase() !== account.email.toLocaleLowerCase() ? t('Invalid_email') : null,
    },
  });

  useEffect(() => {
    form.clearErrors();
    form.reset();
  }, [opened]);

  return (
    <>
      <Dialog
        customType={OAMDialogType.FORM}
        opened={opened}
        onClose={onCancel}
        title={t('Reenter_your_email_to_delete')}
        leftButton={t('Cancel')}
        rightButton={t('Delete_account')}
        onLeftClick={onCancel}
        onRightClick={() => {
          const isValid = form.isValid();
          if (isValid) {
            onSubmit();
          }
        }}
        formSubmit={form.onSubmit(() => {})}
      >
        <TextInput placeholder={`${t('Email')}`} type="email" {...form.getInputProps('email')} />
      </Dialog>
    </>
  );
};

export const useMessagePopup = () => {
  const [openedPopup, { open, close }] = useDisclosure(false);
  const [message, setMessage] = React.useState<DefaultTFuncReturn | JSX.Element>();
  const [title, setTitle] = React.useState('');
  const [rightButton, setRightButton] = React.useState<DefaultTFuncReturn>('');
  const [leftButton, setLeftButton] = React.useState<DefaultTFuncReturn>();
  const rightButtonFun = useRef<() => void>();
  const leftButtonFun = useRef<() => void>();
  const onRightClick = () => {
    close();
    if (rightButtonFun.current) {
      rightButtonFun.current();
    }
  };

  const onLeftClick = () => {
    close();
    if (leftButtonFun.current) {
      leftButtonFun.current();
    }
  };

  const onOpen = ({
    tit = '',
    msg = '',
    rightBtn = 'rightBtn',
    rightBtnClick,
    leftBtn,
    leftBtnClick,
  }: Open) => {
    close();
    setRightButton(rightBtn);
    rightButtonFun.current = rightBtnClick;
    setLeftButton(leftBtn);
    leftButtonFun.current = leftBtnClick;
    setTitle(tit!);
    setMessage(msg);
    open();
  };

  const body = useMemo(
    () => (
      <Dialog
        customType={OAMDialogType.MESSAGE}
        opened={openedPopup}
        onClose={close}
        title={title}
        message={message}
        leftButton={leftButton}
        rightButton={rightButton}
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
      />
    ),
    [openedPopup, message],
  );
  return {
    body,
    open: onOpen,
    close,
  };
};

export const useChangeLocationPopup = () => {
  const { t } = useTranslation();
  const router = useRouter();
  // const [messageOpened, { open: messageOpen, close: messageClose }] = useDisclosure(false);
  const [openedPopup, { open, close }] = useDisclosure(false);
  const resultFun = useRef<(password: string) => void>();
  const cancelFun = useRef<() => void>();
  const [updateOrganization, changeLocationStatus] = useUpdateOrganizationMutation();
  const form = useForm({
    initialValues: {
      type: '',
      othersName: '',
      country: '',
      state: '',
      city: '',
      address: '',
    },
    validate: {
      country: isNotEmpty(),
    },
    validateInputOnBlur: true,
  });

  const onOpen = ({
    result = (password: string) => console.log(password),
    cancel = () => {},
    form: formValues,
  }: Open) => {
    close();
    resultFun.current = result;
    cancelFun.current = cancel;
    if (formValues) form.setValues(formValues.values);
    open();
  };

  const onCancel = () => {
    close();
    if (cancelFun.current) {
      cancelFun.current();
    }
  };
  // const handleBacktoLogin = () => {
  //   messageClose();
  //   router.push('/auth/signIn');
  // };

  const handleRightClick = async () => {
    try {
      if (form.validate().hasErrors) return;

      const { country, city, state, address, type, othersName } =
        form.values as OrganizationPayload;

      console.log(form.values);
      const result = await updateOrganization({
        updateTarget: 2,
        country,
        city,
        state,
        address,
      }).unwrap();

      if (result) {
        close();
        // messageOpen();
      }
    } catch (error: any) {
      if (error.status === 400 && error.data.message) {
        // TODO i18n
        form!.setFieldError('error', 'Your inputs is incorrect.');
      }
    }
  };

  const body = useMemo(
    () => (
      <>
        <Dialog
          customType={OAMDialogType.FORM}
          opened={openedPopup}
          onClose={close}
          title={t('Change_location')}
          leftButton={t('Cancel')}
          rightButton={t('Ok')}
          onLeftClick={onCancel}
          onRightClick={handleRightClick}
          formSubmit={form.onSubmit(() => handleRightClick())}
          // formSubmit={form.onSubmit(() => handleRightClick())}
        >
          <LocationInput
            required
            data-autofocus
            radius="md"
            mb={rem(10)}
            w="100%"
            {...form.getInputProps('country')}
            onChange={(v) => {
              form.setFieldValue('state', '');
              form.getInputProps('country').onChange(v);
            }}
          />
          <StateInput
            // required
            location={form.values.country}
            data-autofocus
            radius="md"
            mb={rem(10)}
            w="100%"
            {...form.getInputProps('state')}
          />
          <TextInput
            // required
            placeholder={t('City').toString()}
            radius="md"
            mb={rem(10)}
            w="100%"
            {...form.getInputProps('city')}
          />
          <TextInput
            // required
            placeholder={t('Address').toString()}
            radius="md"
            mb={rem(10)}
            w="100%"
            {...form.getInputProps('address')}
          />
        </Dialog>
        {/* <Dialog
        customType={OAMDialogType.FORM}
        opened={messageOpened}
        onClose={messageClose}
        title="Location Changed"
        message="You can login with new Location now"
        leftButton="Back to login"
        onLeftClick={messageClose}
      /> */}
      </>
    ),
    [openedPopup, form],
  );
  return {
    body,
    open: onOpen,
    close,
  };
};

export const useChangePasswordPopup = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [messageOpened, { open: messageOpen, close: messageClose }] = useDisclosure(false);
  const [openedPopup, { open, close }] = useDisclosure(false);
  const resultFun = useRef<(password: string) => void>();
  const cancelFun = useRef<() => void>();
  const [changePassword, changePassWordStatus] = useChangePasswordMutation();
  const { newPasswordValidator } = useChainValidator();
  const form = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validateInputOnBlur: true,
    validate: {
      newPassword: newPasswordValidator,
      confirmPassword: matchesField('newPassword', t('Passwords_do_not_match')),
    },
  });

  const onOpen = ({ result = () => {}, cancel = () => {} }: Open) => {
    close();
    resultFun.current = result;
    cancelFun.current = cancel;
    open();
  };

  const onCancel = () => {
    close();
    form.reset();
    if (cancelFun.current) {
      cancelFun.current();
    }
  };
  const handleBacktoLogin = () => {
    messageClose();
    resultFun.current && resultFun.current(form.values.newPassword);
    form.reset();
  };

  const handleRightClick = async () => {
    try {
      if (form.validate().hasErrors) return;

      const { oldPassword, newPassword } = form.values;
      const result = await changePassword({ oldPassword, newPassword }).unwrap();

      if (result) {
        close();
        messageOpen();
      }
    } catch (error: any) {
      if (error.status === 400 && error.data.message) {
        form.setFieldError('oldPassword', t('Your_current_password_is_incorrect'));
      }
    }
  };

  const body = useMemo(
    () => (
      <>
        <Dialog
          customType={OAMDialogType.FORM}
          opened={openedPopup}
          onClose={close}
          title={t('Change_password')}
          leftButton={t('Cancel')}
          rightButton={t('Change')}
          onLeftClick={onCancel}
          onRightClick={handleRightClick}
          formSubmit={form.onSubmit(() => {})}
        >
          <PasswordInput
            required
            data-autofocus
            placeholder={t('Current_password').toString()}
            radius="md"
            mb={rem(10)}
            w="100%"
            h={rem(56)}
            {...form.getInputProps('oldPassword')}
            visibilityToggleIcon={({ reveal, size }: { reveal: boolean; size: number | string }) =>
              reveal ? <Hide /> : <Show />
            }
          />
          <PasswordInput
            required
            data-autofocus
            placeholder={t('New_password').toString()}
            radius="md"
            mb={rem(10)}
            w="100%"
            h={rem(56)}
            {...form.getInputProps('newPassword')}
            visibilityToggleIcon={({ reveal, size }: { reveal: boolean; size: number | string }) =>
              reveal ? <Hide /> : <Show />
            }
          />
          <PasswordInput
            required
            placeholder={t('Confirm_new_password').toString()}
            radius="md"
            mb={rem(5)}
            w="100%"
            h={rem(56)}
            {...form.getInputProps('confirmPassword')}
            visibilityToggleIcon={({ reveal, size }: { reveal: boolean; size: number | string }) =>
              reveal ? <Hide /> : <Show />
            }
          />
        </Dialog>
        <Dialog
          customType={OAMDialogType.FORM}
          opened={messageOpened}
          onClose={messageClose}
          title={t('Password_changed')}
          message={t('You_can_login_with_new_password_now')}
          leftButton={t('Back_to_login')}
          onLeftClick={handleBacktoLogin}
        />
      </>
    ),
    [openedPopup, form],
  );
  return {
    body,
    open: onOpen,
    close,
  };
};

export const useResetPasswordPopup = () => {
  const { t } = useTranslation();
  const [openedPopup, { open, close }] = useDisclosure(false);
  const resultFun = useRef<(password: string) => void>();
  const cancelFun = useRef<() => void>();
  const { passwordValidator } = useChainValidator();
  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validateInputOnBlur: true,
    validate: {
      password: passwordValidator,
      confirmPassword: matchesField('password', t('Passwords_do_not_match')),
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

  const onOpen = ({
    result = (password: string) => console.log(password),
    cancel = () => {},
  }: Open) => {
    close();
    resultFun.current = result;
    cancelFun.current = cancel;
    open();
  };

  const onChange = () => {
    close();
    if (resultFun.current) {
      resultFun.current(form.values.password);
    }
  };

  const onCancel = () => {
    close();
    form.reset();
    if (cancelFun.current) {
      cancelFun.current();
    }
  };

  const body = useMemo(
    () => (
      <Dialog
        customType={OAMDialogType.FORM}
        opened={openedPopup}
        onClose={close}
        title={t('Change_password')}
        message={t('Please_fill_in_your_new_password_twice')}
        leftButton={t('Cancel')}
        rightButton={t('Change')}
        onLeftClick={onCancel}
        onRightClick={onChange}
        formSubmit={form.onSubmit(() => {})}
        isValid={form.isValid()}
      >
        <PasswordInput
          required
          data-autofocus
          placeholder={t('Password').toString()}
          radius="md"
          mb={rem(10)}
          w="100%"
          h={rem(56)}
          {...form.getInputProps('password')}
          visibilityToggleIcon={({ reveal, size }: { reveal: boolean; size: number | string }) =>
            reveal ? <Hide /> : <Show />
          }
        />
        <PasswordInput
          required
          placeholder={t('Confirm_password').toString()}
          radius="md"
          mb={rem(5)}
          w="100%"
          h={rem(56)}
          {...form.getInputProps('confirmPassword')}
          visibilityToggleIcon={({ reveal, size }: { reveal: boolean; size: number | string }) =>
            reveal ? <Hide /> : <Show />
          }
        />
      </Dialog>
    ),
    [openedPopup, form],
  );
  return {
    body,
    open: onOpen,
    close,
  };
};

export const useInvitationPasswordPopup = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [_email, _setEmail] = useState<string>('');
  const [openedPopup, { open, close }] = useDisclosure(false);
  const callback = useRef<(password: string) => void>();
  const { passwordValidator } = useChainValidator();
  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validateInputOnBlur: true,
    validate: {
      password: passwordValidator,
      confirmPassword: matchesField('password', t('Passwords_do_not_match')),
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

  const onOpen = ({ email = 'email', result = (password) => console.log(password) }: Open) => {
    close();
    _setEmail(email);
    callback.current = result;
    open();
  };

  const onSetup = () => {
    close();
    if (callback.current) {
      callback.current(form.values.password);
    }
  };

  const body = useMemo(
    () => (
      <Dialog
        customType={OAMDialogType.FORM}
        opened={openedPopup}
        onClose={close}
        rightButton={t('Setup')}
        onRightClick={onSetup}
        formSubmit={form.onSubmit(() => {})}
        isValid={form.isValid()}
      >
        <Text fw={500} mb={rem(20)}>
          {t('Setup_password')}
        </Text>
        <TextInput required disabled radius="md" mb={rem(20)} w="100%" value={_email} />
        <PasswordInput
          required
          data-autofocus
          placeholder={t('Password').toString()}
          radius="md"
          mb={rem(20)}
          w="100%"
          styles={() => ({
            root: {
              height: rem(36),
            },
            wrapper: {
              marginBottom: 0,
            },
          })}
          {...form.getInputProps('password')}
          visibilityToggleIcon={({ reveal, size }: { reveal: boolean; size: number | string }) =>
            reveal ? <Hide /> : <Show />
          }
        />
        <PasswordInput
          required
          placeholder={t('Confirm_password').toString()}
          radius="md"
          mb={rem(20)}
          w="100%"
          styles={() => ({
            root: {
              height: rem(36),
            },
            wrapper: {
              marginBottom: 0,
            },
          })}
          {...form.getInputProps('confirmPassword')}
          visibilityToggleIcon={({ reveal, size }: { reveal: boolean; size: number | string }) =>
            reveal ? <Hide /> : <Show />
          }
        />
      </Dialog>
    ),
    [openedPopup, form, _email],
  );

  return {
    body,
    open: onOpen,
    close,
  };
};

// TODO license plan Upgrade
export const useMessageWithClosePopup = () => {
  const [openedPopup, { open, close }] = useDisclosure(false);
  const [message, setMessage] = React.useState<DefaultTFuncReturn | JSX.Element>();
  const [title, setTitle] = React.useState<DefaultTFuncReturn>('');

  const onOpen = ({ tit = '', msg = '' }: Open) => {
    close();
    setTitle(tit);
    setMessage(msg);
    open();
  };

  const body = useMemo(
    () => (
      <Modal
        opened={openedPopup}
        onClose={close}
        centered
        closeOnEscape
        closeOnClickOutside={false}
        // ?? withCloseButton
        title={title}
        size={1000}
      >
        {typeof message === 'string' ? (
          <Text size="lg" fw={400} color="gray">
            {message}
          </Text>
        ) : (
          message
        )}
      </Modal>
    ),
    [openedPopup, message],
  );
  return {
    body,
    open: onOpen,
    close,
  };
};

export const useUserDeletePopup = () => {
  const { t } = useTranslation();
  const [_email, _setEmail] = useState<string>('');
  const [openedPopup, { open, close }] = useDisclosure(false);
  const [emailPopupOpened, emailPopupActions] = useDisclosure(false);
  const cancelFun = useRef<() => void>();
  const callback = useRef<(...args: any[]) => void>();
  const form = useForm({
    initialValues: {
      email: '',
    },
    validateInputOnBlur: true,
    validate: {
      email: isEmail(t('Invalid_email')),
    },
  });

  const onOpen = ({ email = 'email', okClick, cancel }: Open) => {
    close();
    _setEmail(email);
    callback.current = okClick;
    cancelFun.current = cancel;
    open();
  };

  const closeAll = () => {
    close();
    emailPopupActions.close();
  };

  const onCancel = () => {
    closeAll();
    form.reset();
    if (cancelFun.current) {
      cancelFun.current();
    }
  };

  const onSubmitEmail = () => {
    emailPopupActions.close();
    callback.current && callback.current();
  };

  const body = useMemo(
    () => (
      <>
        <Dialog
          customType={OAMDialogType.MESSAGE}
          opened={openedPopup}
          onClose={close}
          title={t('Delete_account')}
          leftButton={t('Cancel')}
          rightButton={t('Delete')}
          onLeftClick={onCancel}
          onRightClick={() => {
            emailPopupActions.open();
            close();
          }}
          formSubmit={form.onSubmit(() => {})}
          message={`${t('Delete_account_content_other')}`}
        />
        <ReEnterEmailPopup opened={emailPopupOpened} onCancel={onCancel} onSubmit={onSubmitEmail} />
      </>
    ),
    [openedPopup, form, emailPopupOpened],
  );
  return {
    body,
    open: onOpen,
    close: closeAll,
  };
};

export const useOwnerUserDeletePopup = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [openedPopup, { open, close }] = useDisclosure(false);
  const [emailPopupOpened, emailPopupActions] = useDisclosure(false);
  const resultFun = useRef<(...args: any[]) => void>();
  const cancelFun = useRef<() => void>();

  const onOpen = ({ okClick, cancel }: Open) => {
    close();
    resultFun.current = okClick;
    cancelFun.current = cancel;
    open();
  };

  const closeAll = () => {
    close();
    emailPopupActions.close();
  };

  const onCancel = () => {
    closeAll();
    if (cancelFun.current) {
      cancelFun.current();
    }
  };

  const onSubmitEmail = () => {
    emailPopupActions.close();
    resultFun.current && resultFun.current();
  };

  const onTransfer = () => {
    close();
    router.push('users');
    resultFun.current && resultFun.current(true);
  };

  const messages = [
    t('Delete_account_content_owner'),
    t('Do_you_want_to_transfer_ownership_first'),
  ];

  const body = useMemo(
    () => (
      <>
        <Dialog
          customType={OAMDialogType.MESSAGE}
          opened={openedPopup}
          onClose={close}
          title={t('Delete_account')}
          leftButton={t('Cancel')}
          extraRightButton={t('Transfer')}
          rightButton={t('Delete directly')}
          onLeftClick={onCancel}
          onRightClick={() => {
            emailPopupActions.open();
            close();
          }}
          extraRightClick={onTransfer}
          message={
            <>
              {messages.map((str, index) => (
                <div key={index} style={{ marginBottom: rem(16) }}>
                  {str}
                </div>
              ))}
            </>
          }
        />
        <ReEnterEmailPopup opened={emailPopupOpened} onCancel={onCancel} onSubmit={onSubmitEmail} />
      </>
    ),
    [openedPopup, emailPopupOpened],
  );
  return {
    body,
    open: onOpen,
    close: closeAll,
  };
};

const useUsableTransferrableUsers = (candidateBlacklist: Set<string>) => {
  const [candidates, setCandidates] = useState<SelectItem[]>([]);

  const [getTransferrableUsers] = useLazyGetTransferrableOrganizationUsersQuery();

  const getUsableTransferrableUsers = useCallback(async () => {
    setCandidates([]);
    const response = await getTransferrableUsers({ omsRole: ['admin'] }, true);
    if ('error' in response) {
      return [];
    }
    const options = response
      .data!.data.data.filter((user) => !candidateBlacklist.has(user.id) && !!user.emailConfirm)
      .map((user) => ({
        value: user.accountId, //fix #Mantis-20915 modify solution_accountId to transfer
        label: user.name,
      }));
    setCandidates(options);
    return options;
  }, [getTransferrableUsers, candidateBlacklist]);

  return {
    transferrableUsers: candidates,
    getUsableTransferrableUsers,
  };
};

export const usePowerUserDeletePopup = () => {
  const { t } = useTranslation();
  const [openedPopup, { open, close }] = useDisclosure(false);
  const [emailPopupOpened, emailPopupActions] = useDisclosure(false);
  const [transferPopupOpened, transferPopupActions] = useDisclosure(false);
  const resultFun = useRef<(...args: any[]) => void>();
  const cancelFun = useRef<() => void>();

  const [userBlacklist, setUserBlacklist] = useState<Set<string>>(new Set<string>());
  const { transferrableUsers, getUsableTransferrableUsers } =
    useUsableTransferrableUsers(userBlacklist);
  const [userValue, setUserValue] = useState<string | null>(null);

  const [message, setMessage] = useState('');

  const onOpen = ({ okClick, cancel, candidateBlacklist, msg }: Open) => {
    close();
    resultFun.current = okClick;
    cancelFun.current = cancel;
    setUserBlacklist(candidateBlacklist || new Set<string>());
    setMessage(msg as string);
    open();
  };

  const closeAll = () => {
    close();
    emailPopupActions.close();
    transferPopupActions.close();
  };

  const onCancel = () => {
    closeAll();
    cancelFun.current && cancelFun.current();
  };

  const powerUserDelete = (close: () => void) => {
    emailPopupActions.open();
    close();
  };

  const onSubmitEmail = () => {
    emailPopupActions.close();
    resultFun.current && resultFun.current();
  };

  const onBeforeTransfer = async () => {
    transferPopupActions.open();
    close();

    setUserValue(null);
    const options = await getUsableTransferrableUsers();
    if (!options || options.length < 1) {
      return;
    }
    setUserValue(options[0].value);
  };

  const onTransfer = () => {
    transferPopupActions.close();
    resultFun.current && resultFun.current(userValue);
  };

  const body = useMemo(
    () => (
      <>
        <Dialog
          customType={OAMDialogType.MESSAGE}
          opened={openedPopup}
          onClose={close}
          title={t('Delete_account')}
          leftButton={t('Cancel')}
          extraRightButton={t('Transfer')}
          rightButton={t('Delete_directly')}
          onLeftClick={onCancel}
          onRightClick={() => powerUserDelete(close)}
          extraRightClick={onBeforeTransfer}
          message={message}
        />
        <Dialog
          customType={OAMDialogType.FORM}
          opened={transferPopupOpened}
          onClose={transferPopupActions.close}
          title={t('Transfer_oms_data')}
          leftButton={t('Cancel')}
          rightButton={transferrableUsers.length > 0 ? t('Transfer') : undefined}
          onLeftClick={onCancel}
          onRightClick={onTransfer}
          formSubmit={(event) => event.preventDefault()}
        >
          <Text>{t('OMS_data_can_only_be_transferred')}</Text>
          <br />
          <Select
            label={t('Transfer_to')}
            placeholder={'Pick value' as string}
            value={userValue || ''}
            data={transferrableUsers}
            disabled={!userValue || transferrableUsers.length < 1}
            dropdownPosition="bottom"
            required
            onChange={(value) => {
              setUserValue(value as string);
            }}
            withinPortal
            autoMaxItems
          />
        </Dialog>
        <ReEnterEmailPopup opened={emailPopupOpened} onCancel={onCancel} onSubmit={onSubmitEmail} />
      </>
    ),
    [openedPopup, emailPopupOpened, transferPopupOpened, userValue, transferrableUsers, message],
  );
  return {
    body,
    open: onOpen,
    close: closeAll,
  };
};

export const useUserDataTransferPopup = () => {
  const { t } = useTranslation();
  const [openedPopup, { open, close }] = useDisclosure(false);
  const [transferPopupOpened, transferPopupActions] = useDisclosure(false);
  const okFun = useRef<(...args: any[]) => void>();
  const cancelFun = useRef<() => void>();

  const [userBlacklist, setUserBlacklist] = useState<Set<string>>(new Set<string>());
  const { transferrableUsers, getUsableTransferrableUsers } =
    useUsableTransferrableUsers(userBlacklist);
  const [userValue, setUserValue] = useState<string | null>(null);

  const [message, setMessage] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [rightButton, setRightButton] = React.useState('');

  const onOpen = ({ okClick, candidateBlacklist, tit, msg, rightBtn, cancel = () => {} }: Open) => {
    close();
    okFun.current = okClick;
    cancelFun.current = cancel;
    setUserBlacklist(candidateBlacklist || new Set<string>());
    setTitle(tit as string);
    setMessage(msg as string);
    setRightButton(rightBtn as string);
    open();
  };

  const closeAll = () => {
    close();
    transferPopupActions.close();
  };

  const onCancel = () => {
    closeAll();
    if (cancelFun.current) {
      cancelFun.current();
    }
  };

  const onNoTransfer = () => {
    close();
    okFun.current && okFun.current();
  };

  const onBeforeTransfer = async () => {
    transferPopupActions.open();
    close();

    setUserValue(null);
    const options = await getUsableTransferrableUsers();
    if (!options || options.length < 1) {
      return;
    }
    setUserValue(options[0].value);
  };

  const onTransfer = () => {
    transferPopupActions.close();
    okFun.current && okFun.current(userValue);
    oamNotifications.show({
      title: t('Role_changed'),
    });
  };

  const body = useMemo(
    () => (
      <>
        <Dialog
          customType={OAMDialogType.MESSAGE}
          opened={openedPopup}
          onClose={close}
          title={title}
          leftButton={t('Cancel')}
          rightButton={rightButton}
          extraRightButton={t('Transfer')}
          onLeftClick={onCancel}
          onRightClick={onNoTransfer}
          extraRightClick={onBeforeTransfer}
          message={message}
        />
        <Dialog
          customType={OAMDialogType.FORM}
          opened={transferPopupOpened}
          onClose={transferPopupActions.close}
          title={t('Transfer_oms_data')}
          leftButton={t('Cancel')}
          rightButton={transferrableUsers.length > 0 ? t('Transfer') : undefined}
          onLeftClick={onCancel}
          onRightClick={onTransfer}
          formSubmit={(event) => event.preventDefault()}
        >
          <Text>{t('OMS_data_can_only_be_transferred')}</Text>
          <br />
          <Select
            label={t('Transfer_to')}
            placeholder={'Pick value' as string}
            data={transferrableUsers}
            dropdownPosition="bottom"
            disabled={!userValue || transferrableUsers.length < 1}
            value={userValue || ''}
            onChange={(value) => {
              setUserValue(value as string);
            }}
            withinPortal
            autoMaxItems
          />
        </Dialog>
      </>
    ),
    [openedPopup, transferPopupOpened, userValue, transferrableUsers],
  );
  return {
    body,
    open: onOpen,
    close: closeAll,
  };
};
