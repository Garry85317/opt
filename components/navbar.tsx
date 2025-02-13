import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createStyles, Navbar, getStylesRef, rem } from '@mantine/core';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { DevicesIcon, DashboardIcon, SignInIcon, HistoryIcon } from './base/icon';
import { limitedRouteRoles, allRoles, Role } from '../utils/role';
import { useJWTContext } from '../providers/jwtProvider';
import { generatePathParts } from '../utils/router';

const useStyles = createStyles((theme) => ({
  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: '#FFFFFF',
    padding: `${rem(14)} ${rem(18)}`,
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: '#415284',
      path: {
        stroke: '#415284',
      },
    },
    [theme.fn.smallerThan('1024')]: {
      justifyContent: 'center',
    },
  },

  linkActive: {
    borderLeft: '5px solid #F2A900',
    paddingLeft: rem(13),
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'white', color: theme.primaryColor }).background,
      color: '#415284',
      path: {
        stroke: '#415284',
      },
    },
  },

  content: {
    padding: theme.spacing.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[9],
    marginLeft: 'auto',
    flex: '1',
  },

  container: {
    display: 'flex',
    minHeight: '100vh',
  },

  navbar: {
    background: '#415284',
    height: '100%',

    [theme.fn.smallerThan('768')]: {
      display: 'none',
    },
  },
  label: {
    [theme.fn.smallerThan('1200')]: {
      display: 'none',
    },
  },
}));

function NavigationBar(props: { active?: string; isShow?: boolean }) {
  const router = useRouter();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(props.active);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { oamRole } = useJWTContext();
  const [pageName] = generatePathParts(router.pathname);
  const { t } = useTranslation();

  const NavItems = [
    { path: '/dashboard', label: t('Dashboard'), icon: DashboardIcon, roles: allRoles },
    { path: '/users', label: t('Users'), icon: SignInIcon, roles: allRoles },
    { path: '/devices', label: t('Devices'), icon: DevicesIcon, roles: allRoles },
    // { path: '/license', label: t('License'), icon: HistoryIcon, roles: limitedRouteRoles },
  ];

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
    </a>
  ));

  useEffect(() => {
    // Scroll to top when change page
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [active]);

  return props.isShow ? (
    <div className={classes.container}>
      <Navbar className={classes.navbar} height={750} width={{ base: 68, sm: 68, md: 68, lg: 220 }}>
        <Navbar.Section>{links}</Navbar.Section>
      </Navbar>
    </div>
  ) : null;
}

export default NavigationBar;
