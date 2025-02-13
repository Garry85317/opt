import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Portal, createStyles, em, getBreakpointValue, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import useCheckGuardian from '../hooks/useCheckGuardian';
import Banner from './banner';

const useStyles = createStyles((theme) => ({
  banner: {
    // position: 'relative',
    // margin: `0 auto ${rem(10)}`,
    // bottom: -10,
    // width: '80%',
  },

  responsiveBanner: {
    // position: 'relative',
    // bottom: -10,
    // width: '100%',
    // width: `calc(100% - ${rem(40)})`,
    // padding: `${rem(0)} ${rem(20)}`,
  },
}));

// TODO check all pages' padding
const GuardianBanner = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const container = useRef<HTMLElement>();
  const theme = useMantineTheme();
  const isSmallerDesktop = useMediaQuery(
    `(max-width: ${em(getBreakpointValue(theme.breakpoints.md) - 1)}`,
  );
  const [mounted, setMounted] = useState(false);
  const { isOpened, sendGuardianConfirm, close } = useCheckGuardian();

  const innerDimensions = (node: HTMLElement) => {
    const computedStyle = window.getComputedStyle(node);
    let width = node.clientWidth; // width with padding
    let height = node.clientHeight; // height with padding

    height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    return { height, width };
  };

  // force portal remount if change router
  useEffect(() => {
    setMounted(false);
  }, [router.pathname]);
  useEffect(() => {
    setMounted(true);
    container.current =
      document.getElementsByTagName('main')[0] || document.getElementById('__next')!;
    return () => {
      setMounted(false);
      container.current = undefined;
    };
  }, [mounted]);

  const content = t('Your_guardian_must_approve_your_account');

  return mounted && container.current ? (
    <Portal
      target={container.current!}
      style={{
        position: 'fixed',
        bottom: 0,
        width: innerDimensions(container.current!).width,
      }}
    >
      {isOpened &&
        (isSmallerDesktop ? (
          <div className={classes.responsiveBanner}>
            <Banner
              type={1}
              content={content}
              action="Resend"
              onAction={sendGuardianConfirm}
              onClose={close}
            />
          </div>
        ) : (
          <div className={classes.banner}>
            <Banner
              type={1}
              content={content}
              action="Resend"
              onAction={sendGuardianConfirm}
              onClose={close}
            />
          </div>
        ))}
    </Portal>
  ) : null;
};

export default GuardianBanner;
