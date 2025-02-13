import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AppShell, Box, Text, Radio, createStyles, rem, Group, Checkbox } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isEmail, useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';
import HeaderBar, { IconTheme } from '../../../components/headerBar';
import LanguageMenu from '../../../components/headerBar/language';
import Dialog, { OAMDialogType } from '../../../components/dialog';
import OAMTextInput, { OAMTextInputType } from '../../../components/base/TextInput';
import {
  useTransCodeMutation,
  useConfirmAgeMutation,
  useAgeDeactiveMutation,
} from '../../../store/services';
import { useDispatch } from '../../../store';
import { DecodeToken } from '../../../utils/types';
import { setAuthInfo } from '../../../store/actions';
import OAMCheckbox from '../../../components/base/Checkbox';

enum AgeLevel {
  Under13 = 'under_thirteen',
  Above13 = 'above_thirteen',
}

const USER_CANCELLED_AUTHORIZE = 400;

const useStyles = createStyles({
  root: {
    color: 'var(--gray-666666, #666)',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
  input: {
    height: rem(82),
    // marginBottom: rem(16),
  },
  text: {
    color: 'var(--01-main-colors-777, #777)',
    fontSize: rem(10),
  },
});

//目前staging沒跳
export default function ConfirmAge() {
  const router = useRouter();
  const { code, type, state } = router.query;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [ageLevelPopupOpened, ageLevelPopupActions] = useDisclosure(true);
  const [exchangeToken] = useTransCodeMutation();
  const [confirmAge] = useConfirmAgeMutation();
  const { classes } = useStyles();
  const [agree, setAgree] = useState<boolean>(false);
  const [ageDeactive] = useAgeDeactiveMutation();
  const [debounce, setDebounce] = useState(false);

  const form = useForm({
    initialValues: {
      ageLevel: '',
      guardianEmail: '',
    },
    validateInputOnBlur: true,
    validate: (values) => ({
      guardianEmail: values.ageLevel === AgeLevel.Under13 && isEmail() ? t('Invalid_email') : null,
    }),
  });

  const onConfirmError = (error: {
    status: number;
    data: { version: string; message: string };
  }) => {
    form.setFieldError('guardianEmail', error.data.message);
  };

  const onResult = async () => {
    if (form.validate().hasErrors) return;
    await confirmAge({
      isChild: form.values.ageLevel === AgeLevel.Under13,
      guardianEmail: form.values.guardianEmail,
      type: type as string,
      state: state as string,
    })
      .unwrap()
      .then(({ data }) => {
        ageLevelPopupActions.close();
        // window.location.href for webview
        if (data?.redirectTo) window.location.href = data?.redirectTo;
      })
      .catch(onConfirmError);
  };

  useEffect(() => {
    if (router.isReady && !code) router.replace({ pathname: '/auth/signIn' });
    if (router.isReady && code && typeof code === 'string') {
      exchangeToken({ code })
        .unwrap()
        .then((data) => {
          const { token } = data.data;
          const { accountId } = jwtDecode<DecodeToken>(token);

          dispatch(
            setAuthInfo({
              accountId,
              token: token.toString(),
            }),
          );
        })
        .catch(() => {
          router.replace({ pathname: '/auth/signIn', query: router.query });
        });
    }
  }, [router.isReady]);

  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      <Box className={classes.root}>
        <Dialog
          customType={OAMDialogType.FORM}
          opened={ageLevelPopupOpened}
          onClose={ageLevelPopupActions.close}
          title=""
          rightButton={t('Submit')}
          leftButton={t('Cancel')}
          onRightClick={() => {}}
          formSubmit={form.onSubmit(onResult)}
          isValid={agree}
          onLeftClick={() => {
            if (debounce === false) {
              setDebounce(true);
              ageDeactive().finally(() => {
                router.replace({
                  pathname: '/',
                  query: {
                    code: USER_CANCELLED_AUTHORIZE,
                  },
                });
                setDebounce(false);
              });
            }
          }}
        >
          {t('3rd_party_account_note')}
          {/* <Radio.Group
            label="Age verification"
            value={form.values.ageLevel}
            onChange={form.getInputProps('ageLevel').onChange}
            name="ageLevel"
            description="Comply with legal age requirements, please confirm your age."
            required
            withAsterisk
            styles={() => ({
              description: {
                marginBottom: rem(16),
                fontSize: rem(12),
              },
              label: {
                marginBottom: rem(12),
                color: 'var(--b-2-b-primary-primary-415284, #415284)',
                fontSize: rem(14),
              },
            })}
          >
            <Group style={{ marginBottom: rem(16) }}>
              {[
                { label: 'Above 13', value: AgeLevel.Above13 },
                { label: 'Under 13', value: AgeLevel.Under13 },
              ].map(({ label, value }) => (
                <Radio
                  key={value}
                  value={value}
                  label={label}
                  styles={() => ({
                    root: { flex: 1 },
                    inner: {
                      'input:checked': {
                        borderColor: 'var(--b-2-b-primary-primary-415284, #415284)',
                        background: 'var(--b-2-b-primary-primary-415284, #415284)',
                      },
                    },
                  })}
                />
              ))}
            </Group>
          </Radio.Group>
          {form.values.ageLevel === 'under_thirteen' && (
            <>
              <OAMTextInput
                className={classes.input}
                customType={OAMTextInputType.BORDER}
                label={t('Guardian email')}
                placeholder="email"
                required
                {...form.getInputProps('guardianEmail')}
              />
              <Text className={classes.text}>
                Since you are under 13 years old, we will send a confirmation email to your
                guardian. Please confirm the activation of the account within 7days from the time
                the email is sent. If the guardian does not confirm within 7 days, your registration
                information will be cleared.
              </Text>
            </>
          )} */}
          <OAMCheckbox
            mt="md"
            checked={agree}
            transitionDuration={0}
            onChange={(e) => setAgree(!agree)}
            label={t('T_and_C_agreement')}
          />
        </Dialog>
      </Box>
    </AppShell>
  );
}
