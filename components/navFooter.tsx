import React, { useState, useEffect, useRef } from 'react';
import { createStyles, Footer, Box, getStylesRef, rem } from '@mantine/core';
import { useRouter } from 'next/router';
import i18n from '../i18n';
import { DevicesIcon, FooterDashBoardIcon, SignInIcon, HistoryIcon } from './base/icon';
import { limitedRouteRoles, allRoles } from '../utils/role';
import { useJWTContext } from '../providers/jwtProvider';
import { generatePathParts } from '../utils/router';

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    padding: '5px',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80px',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: '#FFFFFF',
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: '#415284',

      path: {
        stroke: '#415284',
      },
    },
  },

  // linkIcon: {
  //   ref: getStylesRef('icon'),
  //   color: '#415284',
  //   path: {
  //     stroke: '#FFFFFF',
  //   },
  // },

  linkActive: {
    color: '#415284',
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'white', color: theme.primaryColor }).background,
      color: '#415284',
      path: {
        stroke: '#415284',
      },
    },
  },

  container: {
    display: 'flex',
    height: rem(56),
    justifyContent: 'space-around',
    background: 'var(--b-2-b-primary-primary-415284, #415284)',
  },

  label: {
    [theme.fn.smallerThan('1200')]: {
      display: 'none',
    },
  },
  name: {
    position: 'relative',
    bottom: '18px',
  },
}));

const NavItems = [
  {
    path: '/dashboard',
    label: i18n.t('Dashboard'),
    icon: FooterDashBoardIcon,
    name: 'Dashboard',
    roles: allRoles,
  },
  {
    path: '/users',
    label: i18n.t('Users'),
    icon: SignInIcon,
    name: 'Users',
    roles: limitedRouteRoles,
  },
  {
    path: '/devices',
    label: i18n.t('Devices'),
    icon: DevicesIcon,
    name: 'Devices',
    roles: limitedRouteRoles,
  },
  // {
  //   path: '/license',
  //   label: i18n.t('License'),
  //   icon: HistoryIcon,
  //   name: 'License',
  //   roles: allRoles,
  // },
];

// TODO Update Icon and add Text
function NavigationFooter(props: { active?: string; isShow?: boolean }) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [active, setActive] = useState(props.active);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { oamRole } = useJWTContext();
  const [pageName] = generatePathParts(router.pathname);
  const links = NavItems.filter(({ roles }) => roles.indexOf(oamRole) >= 0).map((item) => (
    <a
      key={item.path}
      href={item.path}
      className={cx(classes.link, pageName === item.path.split('/')[1] && classes.linkActive)}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        router.push(item.path);
      }}
    >
      <item.icon stroke="1.5" />
      <span className={classes.label}>{item.label}</span>
      <p className={classes.name}>{item.name}</p>
    </a>
  ));

  useEffect(() => {
    // Scroll to top when change page
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [active]);

  return props.isShow ? (
    <Footer height={56}>
      <Box className={classes.container}>{links}</Box>
    </Footer>
  ) : null;
}

export default NavigationFooter;
