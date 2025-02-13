import {
  createStyles,
  Header,
  Menu,
  Button,
  Group,
  Image,
  Container,
  rem,
  Text,
  Flex,
  Avatar,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import React, { memo, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { useSelector } from '../../store';
import { modifyImageColor } from '../../utils/image';
import { selectAccount } from '../../store/slices';
import { BackIcon, OamIcon, OamWhiteIcon } from '../base/icon';
import { Role } from '../../utils/role';
import { useJWTContext } from '../../providers/jwtProvider';

export enum IconTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  inner: {
    height: rem(HEADER_HEIGHT),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  goBack: {
    // outline: 'ridge',
    outlineColor: '#93A9C9',
    width: rem(40),
    height: rem(40),
    padding: 0,
    borderRadius: 20,
    background: '#01256B',
    ':not([data-disabled]):hover': {
      background: 'rgba(256, 256, 256, 0.2)',
    },
    ':not([data-disabled]):focus': {
      background: 'rgba(256, 256, 256, 0.4)',
    },
  },

  avatar: {
    [theme.fn.smallerThan('372')]: {
      display: 'none',
    },
  },

  title: {
    fontWeight: 400,
    color: 'white',
  },

  firstName: {
    [theme.fn.smallerThan('1024')]: {
      position: 'absolute',
      top: '8px',
    },
  },

  secondName: {
    [theme.fn.smallerThan('1024')]: {
      position: 'absolute',
      bottom: '6px',
    },
  },

  links: {
    display: 'flex',
    justifyContent: 'end',
    minWidth: rem(200),
  },
}));

export const useHeaderStyle = createStyles((theme) => ({
  dropDown: {
    backgroundColor: theme.white,
    borderColor: '#7B7B7B',
    borderWidth: rem(2),
  },

  text: {
    color: '#444444',
    lineHeight: theme.lineHeight,
  },
}));

const useButtonStyle = createStyles((theme) => ({
  button: {
    display: 'block',
    lineHeight: theme.lineHeight,
    padding: `${rem(4)}`,
    border: 'none',
    textDecoration: 'none',
    color: theme.white,
    width: '46px',
    height: '46px',
    fontWeight: 400,
    borderRadius: '50%',
    ':not([data-disabled]):hover': {
      backgroundColor: '#93A9C933',
    },
    ':not([data-disabled]):focus': {
      background: '#93A9C966',
    },
  },
}));

const useIconStyle = createStyles((theme) => ({
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: theme.lineHeight,
    padding: `${rem(4)}`,
    border: 'none',
    textDecoration: 'none',
    color: theme.white,
    width: '46px',
    height: '46px',
    fontWeight: 400,
    borderRadius: '50%',
    ':not([data-disabled]):hover': {
      backgroundColor: '#93A9C933',
    },
    ':not([data-disabled]):focus': {
      background: '#93A9C966',
    },
  },
}));

const useMenuStyle = createStyles((theme) => ({
  dropDown: {
    backgroundColor: theme.white,
    borderWidth: rem(1),
    borderColor: 'var(--gray-cccccc, #CCC)',
    borderRadius: rem(6),
    padding: 0,
  },
}));

export const OptionsMenu = ({ children }: { children: ReactNode }) => {
  const { classes } = useMenuStyle();
  return <Menu.Dropdown className={classes.dropDown}>{children}</Menu.Dropdown>;
};

export const HeaderIcon = ({
  theme = IconTheme.LIGHT,
  light,
  dark,
}: {
  theme?: IconTheme;
  light?: ReactNode;
  dark: ReactNode;
}) => {
  const { classes } = useIconStyle();
  return (
    <Menu.Target>
      <UnstyledButton className={classes.icon}>
        {theme === IconTheme.LIGHT ? light : dark}
      </UnstyledButton>
    </Menu.Target>
  );
};

export const HeaderButton = ({
  namespace,
  color,
  base64str,
}: {
  namespace: string;
  color?: string;
  base64str?: string;
}) => {
  const { classes } = useButtonStyle();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [base64, setBase64] = useState(base64str);
  const account = useSelector(selectAccount);

  useEffect(() => {
    setUserName(account.name && account.name.length > 0 ? account.name[0] : '');
  }, [account]);

  useEffect(() => {
    async function modifyImage() {
      if (color && base64str) {
        const base64Str = await modifyImageColor(base64str, color);
        setBase64(base64Str);
      }
    }

    if (base64str) {
      modifyImage().catch((error) => {
        console.error('error', error);
      });
    }
  }, [base64str]);

  const body = useMemo(() => {
    if (namespace === 'Account') {
      return (
        <Flex direction="column" align="center">
          <Avatar color="blue" radius="xl" size="sm" alt={namespace}>
            {userName}
          </Avatar>
        </Flex>
      );
    }
    if (base64) {
      return <Image src={base64} alt={namespace} />;
    }
    return <Text>{t(namespace)}</Text>;
  }, [base64, userName, namespace]);

  return (
    <Menu.Target>
      <Button variant="outline" className={classes.button} compact>
        {body}
      </Button>
    </Menu.Target>
  );
};

interface HeaderBarProps {
  children?: ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  isShowGoback?: boolean;
}

const HeaderBar = ({ children, isShowGoback, backgroundColor, titleColor }: HeaderBarProps) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const { oamRole } = useJWTContext();
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const goBack = () => {
    if (oamRole !== Role.OAM_ROLE_USER) router.replace('/dashboard'); //router.back();
  };

  return (
    <Header
      height={HEADER_HEIGHT}
      style={{ backgroundColor: backgroundColor || '#01256B', border: 0 }}
    >
      <Container className={classes.inner} fluid>
        <Group
          style={{
            gap: rem(12),
          }}
        >
          {isShowGoback && oamRole !== Role.OAM_ROLE_USER ? (
            <Flex align="center">
              <Button className={classes.goBack} onClick={goBack}>
                <BackIcon />
              </Button>
              <Text
                className={classes.title}
                style={{
                  color: titleColor || '#FFFFFF',
                }}
              >
                <span>{t('Back')}</span>
              </Text>
            </Flex>
          ) : (
            <>
              {backgroundColor !== '#01256B' ? (
                <OamIcon />
              ) : (
                <OamWhiteIcon style={{ background: '#01256B' }} />
              )}
              <Text
                className={classes.title}
                style={{
                  color: titleColor || '#FFFFFF',
                  alignItems: 'center',
                }}
              >
                {!isMobile && <span>{t('My_account')}</span>}
              </Text>
            </>
          )}
        </Group>
        <Group spacing={5} className={classes.links}>
          {children}
        </Group>
      </Container>
    </Header>
  );
};

export default memo(HeaderBar);
