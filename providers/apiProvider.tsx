import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { LoadingOverlay } from '@mantine/core';
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { apiUpdateUserRole, Response } from '../utils/apis';
import { usePopup } from './popupProvider';
import { useSelector } from '../store';
import { selectAccessToken, selectGeo, selectOrganization } from '../store/slices';
import { AccessControlModel, Role } from '../utils/role';
import { CustomLoader } from '../components/customLoader';
import { useGetByCloudflareMutation } from '../store/services';
import { OPTOMA_REGION_DATA } from '../utils/constant';
import { useLanguageContext } from './languageProvider';

const zendeskKeyEMEA = `${process.env.NEXT_PUBLIC_ZENDESK_SCRIPT_KEY_EMEA}`;
const zendeskFormIdEMEA = `${process.env.NEXT_PUBLIC_ZENDESK_FORM_ID_EMEA}`;
const zendeskKeyAmericas = `${process.env.NEXT_PUBLIC_ZENDESK_SCRIPT_KEY_AMERICAS}`;
const zendeskFormIdAmericas = `${process.env.NEXT_PUBLIC_ZENDESK_FORM_ID_AMERICAS}`;
const zendeskKeyAsiaOceania = `${process.env.NEXT_PUBLIC_ZENDESK_SCRIPT_KEY_ASIAOCEANIA}`;
const zendeskFormIdAsiaOceania = `${process.env.NEXT_PUBLIC_ZENDESK_FORM_ID_ASIAOCEANIA}`;
const zendeskKeyChina = `${process.env.NEXT_PUBLIC_ZENDESK_SCRIPT_KEY_CHINA}`;
const zendeskFormIdChina = `${process.env.NEXT_PUBLIC_ZENDESK_FORM_ID_CHINA}`;

const zendeskKeyFormMapping = {
  EMEA: {
    key: zendeskKeyEMEA,
    form: zendeskFormIdEMEA,
  },
  Americas: {
    key: zendeskKeyAmericas,
    form: zendeskFormIdAmericas,
  },
  AsiaOceania: {
    key: zendeskKeyAsiaOceania,
    form: zendeskFormIdAsiaOceania,
  },
  China: {
    key: zendeskKeyChina,
    form: zendeskFormIdChina,
  },
};

export enum ZendeskBotType {
  Messenger = 'messenger',
  Classic = 'classic',
}
export interface IAPIProvider {
  showLoading?: boolean;
  backToLogin?: boolean;
  skipExpiredToken?: boolean;
  showPopup?: boolean;
  disableErrorHandle?: boolean;
}

interface ZendeskKeyForm {
  key: string;
  form: string;
}

function baseReturn<T = any>(): Promise<AxiosResponse<Response<T>, any> | null> {
  return Promise.reject<AxiosResponse<Response<T>, any> | null>(new Error('Not implemented'));
}

const initialState = {
  apiUserTransferOwner: async (
    data: {
      oldOwnerId: string;
      newOwnerId: string;
      ownerOmsRole: string;
    } & IAPIProvider,
  ) => baseReturn<string>(),
  zendeskKeyFormData: { key: '', form: '', botType: '' as ZendeskBotType },
};

declare global {
  interface Window {
    zE?: any;
    zESettings?: any;
  }
}

const APIContext = createContext(initialState);

const APIProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { message } = usePopup();
  const token = useSelector(selectAccessToken);
  const [getByCloudflare] = useGetByCloudflareMutation();
  const geoData = useSelector(selectGeo);
  const [zendeskKeyForm, setZendeskKeyForm] = useState<ZendeskKeyForm>({
    key: '',
    form: '',
  });
  const [botType, setBotType] = useState<ZendeskBotType | ''>('');
  const [currentKey, setCurrentKey] = useState<string>('');
  const organization = useSelector(selectOrganization);

  const onBackToLogin = useCallback(() => {
    router.push({ pathname: '/', query: router.query }).catch((err) => console.error(err));
  }, [router]);

  const handleError = (error: unknown, data?: IAPIProvider) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<Response>;
      const { response } = axiosError;
      if (response) {
        if (!(data?.disableErrorHandle ?? false)) {
          if (response.status === HttpStatusCode.Unauthorized) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            if (data?.showPopup ?? true) {
              message.open({
                tit: t('Error'),
                msg: response.data.errorMessage,
                rightBtn: t('Back_to_login'),
                rightBtnClick: () => {
                  if (data?.backToLogin ?? true) {
                    onBackToLogin();
                  }
                },
              });
            }
          } else if (response.status >= 500) {
            message.open({ tit: t('Error'), msg: 'Server Error', rightBtn: t('Ok') });
          } else {
            throw axiosError;
          }
        } else {
          throw axiosError;
        }
      } else {
        message.open({ tit: t('Error'), msg: 'Server Error', rightBtn: t('Ok') });
      }
    }
    console.error(error);
    return null;
  };

  const handleResponse = (response: AxiosResponse<Response, any>) => {
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return response;
    }
    console.log(response);
    return null;
  };

  const userTransferOwner = useCallback(
    async (
      data: { newOwnerId: string; oldOwnerId: string; ownerOmsRole: string } & IAPIProvider,
    ): Promise<AxiosResponse<Response, any> | null> => {
      if (data.showLoading ?? true) {
        setLoading(true);
      }
      try {
        const mainResponse = handleResponse(
          await apiUpdateUserRole(
            {
              id: data.newOwnerId,
              oamRole: Role.OAM_ROLE_OWNER,
              omsRole: AccessControlModel.getAutoOmsRole(Role.OAM_ROLE_OWNER),
            },
            token,
          ),
        );
        await apiUpdateUserRole(
          {
            id: data.oldOwnerId,
            oamRole: Role.OAM_ROLE_ADMIN,
            omsRole: data.ownerOmsRole,
          },
          token,
        );
        return mainResponse;
      } catch (error) {
        if (!(data.skipExpiredToken ?? false)) {
          return await userTransferOwner({ ...data, skipExpiredToken: true });
        }
        return handleError(error, data);
      } finally {
        if (data.showLoading ?? true) {
          setLoading(false);
        }
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) {
      //get client ip, location(country code)
      getByCloudflare();
    }
  }, [token]);

  const getZendeskKeyFromByUserInfo = (location: string) => {
    let zendeskKeyForm: ZendeskKeyForm;

    if (OPTOMA_REGION_DATA.EMEA.includes(location)) {
      zendeskKeyForm = zendeskKeyFormMapping.EMEA;
    } else if (OPTOMA_REGION_DATA.Americas.includes(location)) {
      zendeskKeyForm = zendeskKeyFormMapping.Americas;
    } else if (OPTOMA_REGION_DATA.AsiaOceania.includes(location)) {
      zendeskKeyForm = zendeskKeyFormMapping.AsiaOceania;
    } else if (OPTOMA_REGION_DATA.China.includes(location)) {
      zendeskKeyForm = zendeskKeyFormMapping.China;
    } else {
      zendeskKeyForm = zendeskKeyFormMapping.EMEA;
    }
    return zendeskKeyForm;
  };

  useEffect(() => {
    if (geoData && geoData.loc) {
      const location = geoData.loc.toUpperCase();
      const zendeskKeyForm = getZendeskKeyFromByUserInfo(location);
      setZendeskKeyForm(zendeskKeyForm);
    }
  }, [geoData]);

  const value = useMemo(
    () => ({
      apiUserTransferOwner: userTransferOwner,
    }),
    [userTransferOwner],
  );

  useEffect(() => {
    if (organization.country) {
      const userCountry = organization.country.toUpperCase();
      const zendeskKeyForm = getZendeskKeyFromByUserInfo(userCountry);
      if (currentKey && zendeskKeyForm.key !== currentKey) {
        window.location.reload();
      }
      if (!currentKey) {
        setZendeskKeyForm(zendeskKeyForm);
      }
    }
  }, [organization]);

  const ZendeskScriptLoader = ({ zendeskKeyForm }: { zendeskKeyForm: ZendeskKeyForm }) => {
    const { language } = useLanguageContext();

    const setZendesLanguage = (language: string, botType: ZendeskBotType | '') => {
      if (language && window.zE && botType) {
        if (botType === ZendeskBotType.Messenger) {
          window.zE('messenger:set', 'locale', language);
        }
        if (botType === ZendeskBotType.Classic) {
          window.zE('webWidget', 'setLocale', language);
        }
      }
    };

    const getWidgetBotType = () =>
      new Promise<ZendeskBotType>((resolve) => {
        const checkWidget = () => {
          if (window.zE?.widget) {
            resolve(window.zE.widget); // messenger or classic
          } else {
            setTimeout(checkWidget, 200);
          }
        };
        checkWidget();
      });

    useEffect(() => {
      // to prevent loading zendesk bot multiple times
      if (currentKey === zendeskKeyForm.key) {
        return;
      }

      // if key or form is not set, don't load zendesk bot
      if (!zendeskKeyForm.key || !zendeskKeyForm.form) {
        return;
      }

      const existingScript = document.getElementById('ze-snippet');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'ze-snippet';
      script.src = `${zendeskKeyForm.key}`;
      script.async = true;
      document.body.appendChild(script);

      setCurrentKey(zendeskKeyForm.key);
      const zendeskFormDefaultSubject = process.env.NEXT_PUBLIC_ZENDESK_FORM_DEFAULT_SUBJECT
        ? `${process.env.NEXT_PUBLIC_ZENDESK_FORM_DEFAULT_SUBJECT}`
        : '';

      script.onload = async () => {
        window.zESettings = {
          // set target form id
          webWidget: {
            contactForm: {
              ticketForms: [{ id: zendeskKeyForm.form }],
              fields: [{ id: 'subject', prefill: { '*': zendeskFormDefaultSubject } }],
            },
          },
        };
        console.log('zendesk loaded');
        const widgetType = await getWidgetBotType();
        setBotType(widgetType);
        // if widgetType is Classic, hide the widget first and set close event callback otherwise it will show default launcher
        if (widgetType === ZendeskBotType.Classic) {
          const closeWidget = () => {
            window.zE('webWidget', 'hide');
          };
          closeWidget();
          window.zE('webWidget:on', 'close', closeWidget);
        }
      };
    }, [zendeskKeyForm, currentKey]);

    useEffect(() => {
      setZendesLanguage(language, botType);
    }, [language, botType]);

    return null;
  };

  return (
    <APIContext.Provider
      value={{
        ...value,
        zendeskKeyFormData: { ...zendeskKeyForm, botType: botType as ZendeskBotType },
      }}
    >
      {zendeskKeyForm.key && <ZendeskScriptLoader zendeskKeyForm={zendeskKeyForm} />}

      <LoadingOverlay
        visible={isLoading}
        overlayBlur={2}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
        }}
        loader={CustomLoader({ loadingText: t('Loading') })}
      />
      {children}
    </APIContext.Provider>
  );
};

export const useApi = () => useContext(APIContext);

export default APIProvider;
