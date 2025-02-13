import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { AppShell, em, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import HeaderBar, { IconTheme } from '../components/headerBar';
import LanguageMenu from '../components/headerBar/language';
import { ContentImage, ContentMidImage, ContentMinImage } from '../components/base/Image';

export default function HomePage() {
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${em(767)}`);
  const isDesktop = useMediaQuery(`(min-width: ${em(1337)}`);

  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          <LanguageMenu theme={IconTheme.LIGHT} />
        </HeaderBar>
      }
    >
      {/* <Group position="center">
        <OAMButton
          onClick={() => {
            window.location.reload();
          }}
        >
          Refreash
        </OAMButton>
      </Group> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: 'calc(100vh - 5.75rem)',
        }}
      >
        {isDesktop ? <ContentImage /> : isMobile ? <ContentMinImage /> : <ContentMidImage />}
      </div>
    </AppShell>
  );
}
