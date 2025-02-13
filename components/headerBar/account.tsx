import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, createStyles, Flex, Menu, rem, Text, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { useSelector } from '../../store';
import { HeaderButton, OptionsMenu } from './index';
import { selectAccount } from '../../store/slices';
import { usePopup } from '../../providers/popupProvider';
import { useJWTContext } from '../../providers/jwtProvider';
import { capitalizeFirstLetter } from '../../utils/text';
import { openZendeskChatbot } from '../../utils/common';
import { useApi } from '../../providers/apiProvider';

const useStyles = createStyles(() => ({
  info: {
    color: '#231F20',
    padding: `${rem(12)} ${rem(20)}`,
    '&[data-hovered]': {
      background: '#EAF0F7',
    },
    ':focus': {
      background: 'rgba(147, 169, 201, 0.4)',
    },
  },
  userInfo: {
    width: rem(182),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginLeft: rem(16),
  },
  ellipsis: {
    wordBreak: 'break-all',
    '@supports(-webkit-line-clamp: 2)': {
      overflow: 'hidden',
      display: '-webkit-box',
      textOverflow: 'ellipsis',
      whiteSpace: 'initial',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
  },
  version: {
    padding: `${rem(10)} ${rem(20)}`,
    fontSize: rem(12),
    fontWeight: 400,
    lineHeight: 'normal',
    color: 'var(--gray-7-b-7-b-7-b, #7B7B7B)',
    borderRadius: `0 0 ${rem(6)} ${rem(6)}`,
    borderTop: `${rem(1)} solid var(--gray-cccccc, #CCC)`,
    background: 'var(--gray-f-2-f-2-f-2, #F2F2F2)',
  },
}));

interface AccountProps {
  onLanguageMenuStateChange: (isOpen: boolean) => void;
}

const Account = ({ onLanguageMenuStateChange }: AccountProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { classes, cx } = useStyles();
  const { message } = usePopup();
  const account = useSelector(selectAccount);
  const { oamRole } = useJWTContext();
  const mantineTheme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${mantineTheme.breakpoints.sm})`);
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const menuWidth = isMobile ? '100%' : 320;
  const { zendeskKeyFormData } = useApi();

  function onClickInfo() {
    router.push('/account');
  }

  const onLogout = () => {
    message.open({
      tit: t('Log_out'),
      msg: '',
      rightBtn: t('Logout'),
      rightBtnClick: () => router.push({ pathname: '/auth/signOut', query: router.query }),
      leftBtn: t('Cancel'),
      leftBtnClick: () => {},
    });
  };

  useEffect(() => {
    setUserName(account.name);
    setEmail(account.email);
  }, [account]);

  useEffect(() => {
    const roleDisplay = `${t(capitalizeFirstLetter(oamRole))}`;
    setRole(roleDisplay);
  }, [oamRole, t]);

  return (
    <>
      <Menu
        key="Account"
        trigger="click"
        position="bottom-start"
        shadow="lg"
        withinPortal
        width={menuWidth}
      >
        <HeaderButton namespace="Account" />
        <OptionsMenu>
          <Menu.Item onClick={onClickInfo} className={cx(classes.info)}>
            <Flex justify="flex-start" align="center" direction="row" wrap="nowrap">
              <Avatar
                w={rem(50)}
                h={rem(50)}
                radius={50}
                alt="Account"
                styles={() => ({
                  placeholder: {
                    color: '#fff',
                    background: 'var(--b-2-b-secondary-465-ee-3, #465EE3)',
                  },
                })}
              >
                <Text fz={26} fw={500}>
                  {userName.at(0)}
                </Text>
              </Avatar>
              <Flex
                justify="flex-start"
                direction="column"
                wrap="nowrap"
                className={classes.userInfo}
              >
                <Text className={classes.ellipsis} fz={12} fw={400} color="#415284">
                  OAM {role}
                </Text>
                <Text className={classes.ellipsis} fz={16} fw={600} py={4}>
                  {userName}
                </Text>
                <Text className={classes.ellipsis} fz={14} fw={400} color="#7B7B7B">
                  {email}
                </Text>
              </Flex>
            </Flex>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item className={cx(classes.info)} onClick={() => onLanguageMenuStateChange(true)}>
            {t('Language')}
          </Menu.Item>

          <Menu.Item
            className={cx(classes.info)}
            onClick={() => openZendeskChatbot(zendeskKeyFormData.botType)}
          >
            {t('Contact_us')}
          </Menu.Item>
          <Menu.Item className={cx(classes.info)} onClick={onLogout}>
            {t('Logout')}
          </Menu.Item>
          <Flex justify="space-between" className={cx(classes.version)}>
            <Text>Version</Text>
            <Text>{process.env.NEXT_PUBLIC_APP_VERSION}</Text>
          </Flex>
        </OptionsMenu>
      </Menu>
    </>
  );
};

export default memo(Account);
