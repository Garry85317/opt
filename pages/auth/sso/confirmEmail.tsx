import { AppShell, Text } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from '../../../store';
import OAMTextInput, { OAMTextInputType } from '../../../components/base/TextInput';
import Dialog, { OAMDialogType } from '../../../components/dialog';
import HeaderBar, { IconTheme } from '../../../components/headerBar';
import LanguageMenu from '../../../components/headerBar/language';
import { usePopup } from '../../../providers/popupProvider';
import { setAuthInfo } from '../../../store/actions';
import {
  useInitialProfileAMAgeActiveMutation,
  useAgeDeactiveMutation,
  useInitialProfileAMAppleEmailMutation,
  useTransCodeMutation,
} from '../../../store/services';
import { DecodeToken } from '../../../utils/types';
import { selectAccessToken } from '../../../store/slices';
import useGeoAPI from '../../../hooks/useGeoAPI';

//If the email isn't registered(age level='above_thirteen', is_init_profile=false), the third-party login callback will enter this page to initialize the profile.
export default function ConfirmEmail() {
  const router = useRouter();
  const { accid: accountId, oamCode, status, code, meta } = router.query;
  const { t } = useTranslation();
  const [emailPopupOpened, emailPopupActions] = useDisclosure(false);
  const [initialProfileAMAppleEmail] = useInitialProfileAMAppleEmailMutation();
  const { message } = usePopup();
  const [ageDeactive] = useAgeDeactiveMutation();
  const [exchangeToken] = useTransCodeMutation();
  const dispatch = useDispatch();
  const [initialProfileAMAgeActive] = useInitialProfileAMAgeActiveMutation();
  const token = useSelector(selectAccessToken);
  const { countryCode } = useGeoAPI();

  if (code) {
    return <></>;
  }

  const cancelAuth = () => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}`);
    url.searchParams.set('code', '400');
    window.location.href = url.href;
  };

  const successAuth = ({
    email,
    accountId,
    accessToken,
  }: {
    email?: string;
    accountId: string;
    accessToken: string;
  }) => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}`);
    email && url.searchParams.set('email', email);
    url.searchParams.set('code', '200');
    url.searchParams.set('accid', accountId as string);
    url.searchParams.set('acctoken', accessToken as string);
    window.location.href = url.href;
  };

  const form = useForm({
    initialValues: {
      email: '',
    },
    validateInputOnBlur: true,
    validate: {
      email: isEmail(t('Invalid_email')),
    },
  });

  const onConfirmError = (error: { status: number; data: string }) => {
    let response = { message: t('Unknown_error') };
    try {
      response = JSON.parse(error.data);
    } catch (err) {
      response.message = t('Unknown_error');
    }
    form.setFieldError('email', response.message);
  };

  const onResult = useCallback(
    async (email: string) => {
      await initialProfileAMAppleEmail({
        email,
        orgCountryCode: countryCode,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).then(({ error }: any) => {
        if (error) {
          onConfirmError(error);
        } else {
          emailPopupActions.close();
          cancelAuth(); //If the email is not confirmed, the user will be redirected to the login page.
        }
      });
    },
    [token],
  );

  useEffect(() => {
    if (oamCode) {
      exchangeToken({ code: oamCode as string })
        .unwrap()
        .then((data) => {
          const { token } = data.data;
          const { accountId, meta } = jwtDecode<DecodeToken>(token);

          if (meta && 'ssoFrom' in meta && meta.ssoFrom !== '') {
            dispatch(
              setAuthInfo({
                accountId,
                token: token.toString(),
              }),
            );
            router.replace(
              {
                pathname: router.pathname,
              },
              undefined,
              { shallow: true },
            );
          } else {
            cancelAuth();
          }
        })
        .catch(() => {
          cancelAuth();
        });
    }
  }, [oamCode]);

  useEffect(() => {
    if (!token && !oamCode) {
      cancelAuth();
    } else {
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
        rightBtn: t('Create admin'),
        rightBtnClick: () => {
          const { meta, email, accountId } = jwtDecode<DecodeToken>(token);

          if (
            meta &&
            'ssoFrom' in meta &&
            meta.ssoFrom === 'apple' &&
            'isPrivateEmail' in meta &&
            meta.isPrivateEmail
          ) {
            //only Apple registers with private email will need the user to write an email, then initial the profile and send the verification email.
            message.close();
            emailPopupActions.open();
          } else {
            initialProfileAMAgeActive({
              orgCountryCode: countryCode,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
              .then((res) => {
                if ('data' in res) {
                  successAuth({
                    email,
                    accountId: `${accountId}`,
                    accessToken: res.data.data.token,
                  });
                } else {
                  throw new Error();
                }
              })
              .catch(() => {
                cancelAuth();
              });
          }
        },
        leftBtn: t('Cancel'),
        leftBtnClick: () => {
          ageDeactive()
            .then(() => {
              cancelAuth();
            })
            .catch(() => {
              cancelAuth();
            });
        },
      });
    }
  }, [oamCode, token]);

  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      <Dialog
        customType={OAMDialogType.FORM}
        opened={emailPopupOpened}
        onClose={emailPopupActions.close}
        // title={t('OAM_web_view')}
        rightButton={t('Ok')}
        onRightClick={() => {
          console.log('onRightClick');
        }}
        formSubmit={form.onSubmit(() => {
          console.log('onSubmit');
          onResult(form.values.email);
        })}
      >
        <OAMTextInput
          customType={OAMTextInputType.BORDER}
          label={t('Email')}
          placeholder="email"
          type="email"
          required
          {...form.getInputProps('email')}
        />
      </Dialog>
    </AppShell>
  );
}
