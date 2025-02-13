import React, { memo, useMemo } from 'react';
import {
  createStyles,
  Menu,
  rem,
  ScrollArea,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useSelector } from '../../store';
import { useLanguageContext } from '../../providers/languageProvider';
import { SUPPORTED_LANGUAGES } from '../../i18n/i81nTypes';
import { HeaderIcon, IconTheme } from './index';
import { LightLanguageIcon, DarkLanguageIcon } from '../base/icon';
import { useUpdateUserMutation } from '../../store/services';
import { selectAccount } from '../../store/slices';

const useStyles = createStyles(() => ({
  text: {
    color: '#444444',
    padding: `${rem(12)} ${rem(14)}`,
    '&[data-hovered]': {
      background: '#EAF0F7',
    },
  },
  active: {
    color: '#415284',
    background: 'rgba(147, 169, 201, 0.4)',
    fontWeight: 700,
  },
}));

interface LanguageMenuProps {
  theme?: IconTheme;
  openByDefault?: boolean;
  isOpened?: boolean;
  onLanguageMenuStateChange?: (isOpen: boolean) => void;
}

const Language = ({
  theme = IconTheme.DARK,
  openByDefault = true,
  isOpened = false,
  onLanguageMenuStateChange,
}: LanguageMenuProps) => {
  const { classes, cx } = useStyles();
  const { language, changeLanguage } = useLanguageContext();
  const account = useSelector(selectAccount);
  const [updateUser] = useUpdateUserMutation();
  const mantineTheme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${mantineTheme.breakpoints.sm})`);
  const menuWidth = isMobile ? '100%' : 200;
  const menuHeight = rem('calc(100vh - 120px)');

  const items = useMemo(
    () =>
      SUPPORTED_LANGUAGES.map((data) => (
        <Menu.Item
          onClick={() => {
            changeLanguage(data.value);
            updateUser({
              name: account.name,
              avatar: '', // TODO
              language: data.value,
              timezone: account.timezone,
              formatDate: account.formatDate,
            });
          }}
          className={cx(classes.text, { [classes.active]: data.value === language })}
          key={data.label}
        >
          {data.label}
        </Menu.Item>
      )),
    [SUPPORTED_LANGUAGES, language],
  );

  const menuByDefault = (
    <Menu trigger="click" position="bottom" shadow="lg" withinPortal width={menuWidth}>
      <HeaderIcon theme={theme} light={<LightLanguageIcon />} dark={<DarkLanguageIcon />} />
      <Menu.Dropdown>
        <ScrollArea offsetScrollbars type="always" h={menuHeight}>
          {items}
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  );

  const menuByCustomEvent = (
    <Menu
      trigger="click"
      position="bottom"
      shadow="lg"
      withinPortal
      width={menuWidth}
      opened={isOpened}
      onChange={(opened) => {
        onLanguageMenuStateChange && onLanguageMenuStateChange(opened);
      }}
    >
      {/*let language menu to show at upper right corner by click other button */}
      <Menu.Target>
        <UnstyledButton h={46} />
      </Menu.Target>
      <Menu.Dropdown>
        <ScrollArea offsetScrollbars type="always" h={menuHeight}>
          {items}
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  );

  return openByDefault ? menuByDefault : menuByCustomEvent;
};

export default memo(Language);
