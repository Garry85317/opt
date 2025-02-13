import React from 'react';
import { Menu, ActionIcon, createStyles, rem } from '@mantine/core';

import { OverflowMenuIcon } from './icon';

const interactiveColor = 'var(--b-2-b-primary-variant-93-a-9-c-9, #93A9C9)';

const useStyles = createStyles(() => ({
  root: {
    width: rem(36),
    height: rem(36),
    ':hover': {
      background: 'none',
    },
    // if want to change svg style while selected
    // ':is([data-expanded])': {
    //   svg: {
    //     fill: 'red',
    //     stroke: 'red',
    //   },
    // },
    ':hover:after': {
      position: 'absolute',
      width: rem(36),
      height: rem(36),
      content: '""',
      opacity: 0.2,
      borderRadius: rem(6),
      background: interactiveColor,
    },
    ':is([data-expanded]):after': {
      position: 'absolute',
      width: rem(36),
      height: rem(36),
      content: '""',
      opacity: 0.4,
      borderRadius: rem(6),
      background: interactiveColor,
    },
  },
  icon: {
    background: 'none',
  },
  disabled: {
    width: rem(36),
    height: rem(36),
    ':is([data-disabled])': {
      opacity: 0.4,
      background: 'none',
      border: 0,
    },
  },
}));

function ActionsMenu({
  actions,
}: {
  actions: {
    value: string;
    label: string;
    disabled: boolean;
    onClick: () => void;
  }[];
}) {
  const { classes, cx } = useStyles();
  const disabledAll = actions.every(({ disabled }) => disabled);
  return (
    <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
      <Menu.Target>
        <ActionIcon
          disabled={disabledAll}
          className={disabledAll ? cx(classes.disabled) : cx(classes.root)}
        >
          <OverflowMenuIcon className={cx(classes.icon)} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {actions.map((item) => (
          <Menu.Item
            className={cx(item.disabled ? classes.disabled : '')}
            onClick={() => item.onClick()}
            key={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

export default ActionsMenu;
