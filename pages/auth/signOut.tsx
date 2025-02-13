import React, { useEffect } from 'react';
import { AppShell, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useSelector } from '../../store';
import { selectAccessToken } from '../../store/slices';
import { useLogoutMutation } from '../../store/services';
import { CustomLoader } from '../../components/customLoader';

export default function Signout() {
  const { t } = useTranslation();
  const router = useRouter();
  const token = useSelector(selectAccessToken);
  const [logout] = useLogoutMutation();
  const { query } = router;

  useEffect(() => {
    if (token) {
      logout();
    } else {
      //router.replace({ pathname: '/auth/signIn', query }).catch((err) => console.log(err));
      window.location.href = '/auth/signIn'; // reload to switch zendesk chat bot
    }
  }, [token]);

  return (
    <AppShell>
      <LoadingOverlay
        overlayBlur={2}
        loader={CustomLoader({ loadingText: t('Loading') })}
        visible
      />
    </AppShell>
  );
}
