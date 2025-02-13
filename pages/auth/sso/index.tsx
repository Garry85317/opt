import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from '../../../store';
import { setAuthInfo } from '../../../store/actions';
import {
  useLazyGetUserQuery,
  useLazyRedirectQuery,
  useTransCodeMutation,
} from '../../../store/services';
import { isJSON } from '../../../utils/common';
import { DecodeToken } from '../../../utils/types';
import { Role } from '../../../utils/role';

export default function SSO() {
  const router = useRouter();
  const { code, state, status, type } = router.query;
  const [exchangeToken] = useTransCodeMutation();
  const dispatch = useDispatch();
  const [getUser, getUserStatus] = useLazyGetUserQuery();
  const [redirect] = useLazyRedirectQuery();

  useEffect(() => {
    if (router.isReady && router.query?.code) {
      const { deleteAccount = undefined } =
        state && typeof state === 'string' && isJSON(state)
          ? (JSON.parse(state as string) as {
              deleteAccount: boolean;
            })
          : {};

      if (code && typeof code === 'string') {
        exchangeToken({ code })
          .unwrap()
          .then((data) => {
            const { token } = data.data;
            const { accountId, oamRole, isInitialProfile } = jwtDecode<DecodeToken>(token);

            dispatch(
              setAuthInfo({
                accountId,
                token: token.toString(),
                hasRedirect: !!type,
              }),
            );
            if (!isInitialProfile) {
              router.replace({
                pathname: '/auth/signUpThirdParty',
                query: router.query,
              });
            } else if (deleteAccount) {
              router.replace({ pathname: '/account', query: { deleteAccount, status } });
            } else {
              // fix: authgaurd沒作用, 在這邊補上導頁

              getUser()
                .unwrap()
                .then((res) => {
                  // go dashboard if has auth, but prevent _app page redirect be cancelled
                  // Dashboard redirect, remark by Howard
                  const pathname = oamRole === Role.OAM_ROLE_USER ? '/account' : '/dashboard';
                  const whitelistString = process.env.NEXT_PUBLIC_NEW_AGREEMENT_WHITELIST;
                  const isRedirectToNewAgreement =
                    res.data &&
                    oamRole === Role.OAM_ROLE_OWNER &&
                    res.data.organization.latestInfoDto?.hasAgreedToTerms !== true;

                  if (!whitelistString) {
                    const { type, ...param } = router.query;
                    router.push({ pathname, query: param });
                  }

                  if (!type) {
                    //No need to redirect to solution
                    if (isRedirectToNewAgreement) {
                      router.replace(
                        {
                          pathname: '/newAgreement',
                          query: { redirectTo: pathname },
                        },
                        '/newAgreement',
                      );
                    } else {
                      router.replace({ pathname: '/dashboard', query: type && { type } }); //d
                    }
                  } else {
                    //Get solution redirect url
                    redirect({
                      type: router.query.type as string,
                      state: router.query.state as string,
                    })
                      .unwrap()
                      .then((res) => {
                        const whitelistArray = whitelistString?.split(',');

                        if (!res.data?.redirectTo) {
                          router.replace({ pathname: '/dashboard' });
                        }

                        const url = new URL(res.data?.redirectTo);
                        const typeString = router.query.type ? (router.query.type as string) : '';

                        if (
                          whitelistArray?.some(
                            (x) => x.toLowerCase() === typeString.toLowerCase(),
                          ) &&
                          isRedirectToNewAgreement
                        ) {
                          router.replace(
                            {
                              pathname: '/newAgreement',
                              query: { redirectTo: url.href },
                            },
                            '/newAgreement',
                          );
                        } else {
                          const routeQuery: Record<string, string | string[]> = { type };
                          router.query.state && (routeQuery.state = router.query.state);
                          router.replace({
                            pathname: '/dashboard',
                            query: routeQuery,
                          });
                        }
                      });
                  }
                });
            }
          })
          .catch(() => {
            router.replace({ pathname: '/auth/signIn', query: router.query });
          });
      }
    }
  }, [router.isReady]);

  return <div />;
}
