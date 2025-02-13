import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { createStyles, Flex, Menu, rem, Anchor, Text, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DisplayShareIcon, OmsIcon, WhiteboardIcon, servicesIcon as Services } from '../base/icon';
import { HeaderIcon, IconTheme } from './index';

const useStyles = createStyles(() => ({
  text: {
    color: '#444444',
    padding: `${rem(6)}`,
    '&[data-hovered]': {
      background: '#EAF0F7',
    },
    ':focus': {
      background: 'rgba(147, 169, 201, 0.4)',
    },
  },
}));

type EnvUrl = {
  prod: string;
  qa: string;
  event?: string;
  staging?: string;
  local: string;
  region?: string;
};

const UrlMap: {
  oms: EnvUrl;
  oss: EnvUrl;
  ds: EnvUrl;
} = {
  oms: {
    prod: 'https://oms.optoma.com/',
    region: 'https://oms-oam-regiontest.azurewebsites.net/',
    qa: 'https://oms-oam-qa.azurewebsites.net/',
    staging: 'https://omstest-rwd2.azurewebsites.net/',
    local: 'https://omstest-rwd2.azurewebsites.net/',
  },
  oss: {
    prod: 'https://creativeboard.optoma.com/',
    region: 'https://whiteboard-event.optoma.com/',
    event: 'https://whiteboard-event.optoma.com/',
    qa: 'https://creativeboard-qa.optoma.com/',
    staging: 'https://teamshareone.optoma.com/',
    local: 'http://test.optoma.com:8888/',
  },
  ds: {
    prod: 'https://displayshare.optoma.com/',
    region: 'https://displayshare.optoma.com/',
    qa: 'https://displayshare.optoma.com/',
    staging: 'https://displayshare.optoma.com/',
    local: 'https://displayshare.optoma.com/',
  },
};

const TypeMap: {
  oms: EnvUrl;
  oss: EnvUrl;
  ds: EnvUrl;
} = {
  oms: {
    prod: 'OMSC_LOGIN',
    region: 'OMSC_LOGIN',
    qa: 'OMSC_LOGIN',
    staging: 'OMSC_LOGIN',
    local: 'OMSC_LOGIN',
  },
  oss: {
    prod: 'CB_LOGIN',
    event: 'CB_LOGIN_EVENT',
    region: 'CB_LOGIN_EVENT',
    qa: 'CB_LOGIN_QA',
    staging: 'CB_LOGIN_DEV',
    local: 'CB_LOGIN_DEV',
  },
  ds: {
    prod: 'DS_LOGIN',
    qa: 'DS_LOGIN',
    staging: 'DS_LOGIN',
    local: 'DS_LOGIN',
  },
};

//Service -> use window.location.origin determine env
//TypeMap -> UrlMap

/*
  key !== 'ds'
    ? `/?type=${TypeMap[key as keyof typeof TypeMap][env as keyof EnvUrl]}&isnineentrance=true`
    : `${UrlMap[key as keyof typeof UrlMap][env as keyof EnvUrl]}`
*/

const Service = () => {
  const { classes, cx } = useStyles();
  const { t } = useTranslation();
  const [[env]] = Object.entries({
    prod: ['https://myaccount.optoma.com'],
    qa: ['https://qa-oam.optoma.com'],
    region: ['https://region-oam.optoma.com'],
    staging: [
      'https://staging-oam.optoma.com',
      'https://rd-oam.optoma.com',
      'https://d3uz1qxoxcwmnh.cloudfront.net', //next version rd site
    ],
    local: 'http://localhost:3000',
  }).filter(
    ([_key, value]) =>
      window.location.origin === value || value.indexOf(window.location.origin) >= 0,
  ) || [['local', 'http://localhost:3000']];
  const mantineTheme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${mantineTheme.breakpoints.sm})`);
  const menuWidth = isMobile ? '100%' : 220;

  const data = [
    {
      key: 'oms',
      namespace: 'OMS',
      icon: OmsIcon,
    },
    {
      key: 'oss',
      namespace: t('Whiteboard'),
      icon: WhiteboardIcon,
    },
    {
      key: 'ds',
      namespace: t('Display_Share'),
      icon: DisplayShareIcon,
    },
  ];

  const items = data.map(({ key, namespace, icon: Icon }) => (
    <Menu.Item key={key} className={cx(classes.text)}>
      <Anchor
        target="_blank"
        href={
          key !== 'ds'
            ? `/?type=${
                TypeMap[key as keyof typeof TypeMap][env as keyof EnvUrl]
              }&isnineentrance=true`
            : `${UrlMap[key as keyof typeof UrlMap][env as keyof EnvUrl]}`
        }
        underline={false}
      >
        <Flex align="center" wrap="nowrap">
          <Icon />
          <Text color="#444444" px="md">
            {t(namespace)}
          </Text>
        </Flex>
      </Anchor>
    </Menu.Item>
  ));

  return (
    <Menu key="Service" trigger="click" position="bottom-start" shadow="lg" withinPortal width={menuWidth}>
      <HeaderIcon theme={IconTheme.DARK} dark={<Services />} />
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
};

export default memo(Service);
