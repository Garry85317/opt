import { ActionIcon, createStyles, rem } from '@mantine/core';
import { OverflowMenuIcon } from './icon';

const interactiveColor = 'var(--b-2-b-primary-variant-93-a-9-c-9, #93A9C9)';

const useStyles = createStyles(() => ({
  root: {
    width: rem(36),
    height: rem(36),
    flexShrink: 0,
    ':hover': {
      borderRadius: rem(6),
      opacity: 0.2,
      background: interactiveColor,
    },
    ':active': {
      opacity: 0.4,
      background: interactiveColor,
    },
  },
  icon: {
    background: 'none',
    // ':hover': {
    //   borderRadius: rem(6),
    //   opacity: 0.2,
    //   background: interactiveColor,
    // },
    // ':active': {
    //   opacity: 0.4,
    //   background: interactiveColor,
    // },
  },
}));

function MenuIcon() {
  const { classes, cx } = useStyles();
  return (
    <ActionIcon className={cx(classes.root)}>
      <OverflowMenuIcon className={cx(classes.icon)} />
    </ActionIcon>
  );
}

export default MenuIcon;
