import { ColorScheme, MantineProvider } from '@mantine/core';
import { NextPage } from 'next';
import NextApp, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { OAMNotifications } from '../components/base/Notifications';
import AuthGuard from '../components/AuthGuard';
import APIProvider from '../providers/apiProvider';
import LanguageProvider from '../providers/languageProvider';
import PopupProvider from '../providers/popupProvider';
import { persistor, wrapper } from '../store';
import { JWTProvider } from '../providers/jwtProvider';
import '@szhsin/react-menu/dist/index.css';

export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

export default function App(
  props: AppProps & { colorScheme: ColorScheme; Component: NextApplicationPage },
) {
  const { Component, ...rest } = props;
  const { store, props: storeProps } = wrapper.useWrappedStore(rest);
  const { pageProps } = storeProps;
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
  const router = useRouter();
  const { query, asPath } = router;
  const forbiddenPage = [] as string[]; // ['/devices', '/devices/devicesAdd', '/license', '/license/oms'];

  console.log(
    "%c pages+_app",
    "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
    "router:",
    router,
    "props",
    props,
    "forbiddenPage:",
    forbiddenPage
  );

  useEffect(() => {
    if (forbiddenPage.includes(asPath as string)) {
      router.replace({ pathname: '/dashboard' });
    }
  }, [asPath]);

  useEffect(() => {
    if (asPath !== '/account' && query?.editAccount === 'true') {
      router.replace({ pathname: '/account', query });
    }
  }, [query?.editAccount]);

  useEffect(() => {
    if (asPath !== '/users/addUser' && query?.addUser === 'true') {
      router.replace({ pathname: '/users/addUser', query });
    }
  }, [query?.addUser]);

  return (
    <Provider store={store}>
      <LanguageProvider>
        <PersistGate loading={null} persistor={persistor}>
          <Head>
            <title>Optoma Account Management</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            <link rel="shortcut icon" href="/favicon.png" />
          </Head>
          <MantineProvider
            theme={{
              colorScheme,
              breakpoints,
              fontFamily: 'Helvetica Neue, Arial, Sans serif',
              lineHeight: 'normal',
              globalStyles,
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <OAMNotifications />
            <APIProvider>
              <PopupProvider>
                <JWTProvider>
                  {Component?.requireAuth ? (
                    <AuthGuard>
                      <Component {...pageProps} />
                    </AuthGuard>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </JWTProvider>
              </PopupProvider>
            </APIProvider>
          </MantineProvider>
        </PersistGate>
      </LanguageProvider>
    </Provider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    // colorScheme: getCookie('mantine-color-scheme', appContext.ctx) ?? 'dark',
  };
};
