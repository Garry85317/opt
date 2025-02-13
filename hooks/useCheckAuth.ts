import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { selectAccessToken } from '../store/slices';
import { useTransCodeMutation } from '../store/services';
import { useSelector } from '../store';

function useCheckAuth() {
  const router = useRouter();
  const { code, redirectUrl } = router.query;
  const token = useSelector(selectAccessToken);
  const [exchangeToken, exchangeTokenStatus] = useTransCodeMutation();

  useEffect(() => {
    if (code && !Array.isArray(router.query.pathname) && router.query.pathname !== 'account') {
      exchangeToken({ code: code as string })
        .unwrap()
        .then(() => {
          if (redirectUrl && typeof redirectUrl === 'string') router.replace(redirectUrl);
          else {
            const { code, ...rest } = router.query;
            router.replace({ query: rest });
          }
        })
        .catch(() => {
          router.push('/auth/signIn');
        });
    }
  }, [code]);

  useEffect(() => {
    if (!code && !token) {
      router
        .push({ pathname: '/auth/signIn', query: router.query })
        .catch((err) => console.log(err));
    }
  }, [token, code]);

  return { token, exchangeTokenStatus };
}

export default useCheckAuth;
