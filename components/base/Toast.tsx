import { Notification, useMantineTheme, createStyles, rem, em, getBreakpointValue } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

const useStyles = createStyles((theme) => ({
  notification: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
  },
  toast: {
    position: 'fixed',
    bottom: '100px',
    width: rem(340),
    height: rem(52),
    background: '#415284' || 'white',
    '.mantine-Text-root': {
      color: 'white',
    },
    '::before': {
      backgroundColor: '#415284' || 'white',
    },
    [theme.fn.smallerThan('1024')]: {
      width: rem(140),
      height: rem(36),
    },
  },
}));

export const Toast = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);

  return isMobile ? (
    <div className={classes.notification}>
      <Notification className={classes.toast} withCloseButton={false}>
        Toast message
      </Notification>
    </div>
  ) : (
    <div className={classes.notification}>
      <Notification className={classes.toast} withCloseButton={false}>
        Toast message Toast message Toast message Toast message Toast message Toast message
      </Notification>
    </div>
  );
};
