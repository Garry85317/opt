// ./test-utils/render.tsx
import React from 'react';
import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

export function render(ui: React.ReactNode) {
    const colorScheme = 'light';
    const breakpoints = {
      xs: '30em', // 480px
      sm: '48em', // 768px
      md: '64em', // 1024px
      lg: '74em', // 1184px
      xl: '90em', // 1440px
    };
    const globalStyles = () => ({
      fontStyle: 'normal',
    });

  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider
        theme={{
        colorScheme,
        breakpoints,
        fontFamily: 'Helvetica Neue',
        lineHeight: 'normal',
        globalStyles,
      }}
        withGlobalStyles
        withNormalizeCSS
      >{children}
      </MantineProvider>
    ),
  });
}
