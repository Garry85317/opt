import React, { useEffect } from 'react';
import { AppShell, Box } from '@mantine/core';
import { useRouter } from 'next/router';
import HeaderBar, { IconTheme } from '../components/headerBar';
import LanguageMenu from '../components/headerBar/language';
import { useSelector } from '../store';
import { selectAccessToken } from '../store/slices';

export default function HomePage() {
  const router = useRouter();
  const token = useSelector(selectAccessToken);

  useEffect(() => {
    if (token) {
      router.replace({ pathname: '/dashboard', query: router.query });
    } else {
      router
        .replace({ pathname: '/auth/signIn', query: router.query })
        .catch((err) => console.log(err));
    }
  }, [token]);

  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      <Box />
    </AppShell>
  );
}
