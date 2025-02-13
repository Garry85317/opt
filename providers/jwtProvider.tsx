import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from '../store';
import {
  selectAccessToken,
  selectAccount,
  selectHasRedirect,
  selectRedirectUrl,
} from '../store/slices';
import { DecodeToken } from '../utils/types';
import { OAMRole, Role } from '../utils/role';
import { useLazyGetUserQuery, usePassportQRCodeMutation } from '../store/services';
import { clearAuthInfo } from '../store/actions';

// Define the type for your JWT context value
type JWTContextType = Omit<
  DecodeToken,
  'exp' | 'iat' | 'jti' | 'name' | 'owner' | 'service' | 'uuid'
>;

const defaultValue = {
  accountId: '',
  email: '',
  oamRole: Role.OAM_ROLE_OWNER as OAMRole,
  isInitialProfile: true,
  meta: {},
};

const JWTContext = createContext<JWTContextType>(defaultValue);

export const JWTProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pathname, query } = router;
  const [jwtInfo, setJwtInfo] = useState<JWTContextType>(defaultValue);
  const token = useSelector(selectAccessToken);
  const hasRedirect = useSelector(selectHasRedirect);
  const account = useSelector(selectAccount);
  const [passportQRCode] = usePassportQRCodeMutation();
  const [getUser, getUserStatus] = useLazyGetUserQuery();

  const handlePassportQRCode = async (qrcode: string) => {
    await passportQRCode({
      qrcode,
    }).unwrap();
  };

  useEffect(() => {
    if (
      !Array.isArray(query.pathname) &&
      query.pathname !== 'account' &&
      query?.status !== 'success' && // if sso login success, status=success
      query?.deleteAccount === 'true'
    ) {
      dispatch(clearAuthInfo());
      router.replace({ pathname: '/auth/signIn', query });
    }
  }, [query?.deleteAccount]);

  useEffect(() => {
    if (token) {
      const { oamRole, isInitialProfile }: DecodeToken = jwtDecode(token);
      if (
        typeof query?.qrcode === 'string' &&
        pathname === '/auth/signIn' &&
        query?.qrcode &&
        isInitialProfile
      ) {
        try {
          handlePassportQRCode(`${query?.qrcode}`);
          delete query?.qrcode;
          const pathname = oamRole === Role.OAM_ROLE_USER ? '/account' : '/dashboard';
          router.replace({ pathname, query });
        } catch (err) {
          router.replace({ pathname: '/auth/signIn' });
        }
      }
    }
  }, [query?.qrcode]);

  useEffect(() => {
    if (token) {
      const { accountId, email, oamRole, isInitialProfile, meta }: DecodeToken = jwtDecode(token);
      if (oamRole) {
        setJwtInfo({
          accountId,
          email,
          oamRole,
          isInitialProfile,
          meta,
        });
      } else {
        console.error('Missing oamRole in JWT token');
      }
      if (
        !Array.isArray(pathname) &&
        pathname === '/auth/signIn' &&
        !query?.deleteAccount &&
        token &&
        account.id
      ) {
        if (!hasRedirect) {
          if (isInitialProfile) {
            getUser()
              .unwrap()
              .then((res) => {
                // go dashboard if has auth, but prevent _app page redirect be cancelled
                // Dashboard redirect, remark by Howard
                const pathname = oamRole === Role.OAM_ROLE_USER ? '/account' : '/dashboard';
                delete query?.qrcode;

                const isRedirectToNewAgreement =
                  res.data &&
                  oamRole === Role.OAM_ROLE_OWNER &&
                  res.data.organization.latestInfoDto?.hasAgreedToTerms !== true &&
                  router.query.isnineentrance !== 'true';//Mantis#20095 trigger by nine entrance

                if (isRedirectToNewAgreement) {
                  router.replace(
                    { pathname: '/newAgreement', query: { redirectTo: pathname } },
                    '/newAgreement',
                  );
                } else {
                  router.replace({ pathname, query });
                }
              });
          } else {
            let meta = {};
            if (query.qrcode) {
              meta = {
                qrcode: query.qrcode,
              };
            }
            router.push({
              pathname: '/auth/signUpThirdParty',
              query: { meta: JSON.stringify(meta) },
            });
          }
        }
      }
    }
  }, [token, account]);

  return <JWTContext.Provider value={jwtInfo}>{children}</JWTContext.Provider>;
};

export const useJWTContext = () => {
  const context = useContext(JWTContext);
  if (context === undefined) {
    return {
      accountId: '',
      email: '',
      oamRole: Role.OAM_ROLE_USER,
      isInitialProfile: null,
      meta: { isPrivateEmail: false },
    };
  }
  return context;
};
