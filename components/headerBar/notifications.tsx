import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, createStyles, Flex, Menu, rem, Text } from '@mantine/core';
import { HeaderIcon, IconTheme, OptionsMenu } from './index';
import { notificationsIcon as NotificationsIcon } from '../base/icon';

const useStyles = createStyles((theme) => ({
  button: {
    padding: '0',
  },
  title: {
    backgroundColor: '0',
  },
  text: {
    color: '#444444',
    lineHeight: theme.lineHeight,
    fontSize: theme.fontSizes.sm,
  },
  item: {
    backgroundColor: theme.white,
    borderTopWidth: rem(2),
    borderTopColor: '#7B7B7B',
    borderTopStyle: 'solid',
  },
  info: {
    width: rem(315),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

const Notifications = () => {
  const { t } = useTranslation();
  const { classes, cx } = useStyles();

  const [fakeData, setFakeData] = useState<{ title: string; read: boolean; time: number }[]>([]);

  const makeAllRead = useCallback(() => {
    fakeData.forEach((d) => (d.read = true));
    setFakeData(fakeData);
  }, [fakeData]);

  //產生假資料
  useEffect(() => {
    setFakeData([
      { title: 'Notifications1', read: false, time: new Date(Date.now()).getTime() }, //現在
      { title: 'Notifications2', read: false, time: new Date(Date.now() - 1000).getTime() }, //一秒前
      { title: 'Notifications3', read: false, time: new Date(Date.now() - 1000 * 60).getTime() }, //1分鐘前
      {
        title: 'Notifications4',
        read: false,
        time: new Date(Date.now() - 1000 * 60 * 60).getTime(),
      }, //1小時前
      {
        title: 'Notifications5',
        read: false,
        time: new Date(Date.now() - 1000 * 60 * 60 * 24).getTime(),
      }, //1天前
      {
        title: 'Notifications6',
        read: false,
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).getTime(),
      }, //6天前
      {
        title: 'Notifications7',
        read: false,
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).getTime(),
      }, //30天前
    ]);
  }, []);

  const calculateDate = (time: number): string => {
    const interval = (Date.now() - time) / 1000;
    if (interval < 60) {
      return t('SecondsAgo', { seconds: Math.trunc(interval) });
    }
    if (interval < 60 * 60) {
      return t('MinutesAgo', { minutes: Math.trunc(interval / 60) });
    }
    if (interval < 60 * 60 * 24) {
      return t('HoursAgo', { hours: Math.trunc(interval / (60 * 60)) });
    }
    if (interval < 60 * 60 * 24 * 7) {
      return t('DaysAgo', { days: Math.trunc(interval / (60 * 60 * 24)) });
    }
    return new Date(time).toLocaleDateString();
  };

  const items = fakeData.map((item) => (
    <Menu.Item p={rem(10)} key={item.time} className={classes.item}>
      <Flex justify="flex-start" direction="column" wrap="nowrap" className={classes.info}>
        <Text className={classes.text}>{item.title}</Text>
        <Text className={classes.text}>{calculateDate(item.time)}</Text>
      </Flex>
    </Menu.Item>
  ));

  return (
    <>
      {/* <Menu
      width={rem(340)}
      key="Notifications"
      trigger="click"
      position="bottom-start"
      offset={10}
      withinPortal
    >
      <HeaderIcon theme={IconTheme.DARK} dark={<NotificationsIcon />} />
      <OptionsMenu>
        <Menu.Label p={rem(0)} key="mark" bg="#DDDDDD" className={classes.text}>
          <Flex justify="space-between" align="center" className={classes.text}>
            <Text pl={rem(10)}>{t('Notifications')}</Text>
            <Button
              pr={rem(10)}
              variant="unstyled"
              bg="none"
              style={{ textDecoration: 'underline', lineHeight: 1 }}
              className={cx(classes.text, classes.button)}
              onClick={makeAllRead}
            >
              {t('Mark_all_as_read')}
            </Button>
          </Flex>
          {items}
        </Menu.Label>
      </OptionsMenu>
      </Menu> */}
    </>
  );
};

export default memo(Notifications);
