import React from 'react';
import {
  Group,
  Flex,
  Text,
  Button,
  CloseButton,
  Paper,
  createStyles,
  rem,
  em,
  getBreakpointValue,
} from '@mantine/core';
import { userBannerType } from '../utils/types';

const bannerTypeMap = {
  [userBannerType.expired]: 'expired',
  [userBannerType.upgrade]: 'upgrade',
};

const useStyles = createStyles((theme) => ({
  banner: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  container: {
    flex: 1,
    alignItems: 'initial',
    gap: rem(20),
    [`@media (min-width: ${em(getBreakpointValue(theme.breakpoints.sm) + 1)})`]: {
      flexDirection: 'row',
    },
    [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm))})`]: {
      flexDirection: 'column',
    },
  },

  bannerContent: {
    display: 'flex',
    minHeight: rem(75),
    // gap: rem(16),
    padding: rem(16),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: rem(6),
  },
  expired: {
    background: 'var(--b-2-b-secondary-f-26600, #F26600);',
  },
  upgrade: {
    background: 'var(--b-2-b-secondary-465-ee-3, #465EE3)',
  },

  title: {
    color: 'var(--gray-ffffff, #FFF)',
    fontSize: rem(16),
    fontWeight: 500,
  },

  content: {
    color: 'var(--gray-ffffff, #FFF)',
    fontSize: rem(14),
    fontWeight: 400,
  },

  action: {
    height: rem(34),
    borderRadius: rem(18),
    color: 'var(--b-2-b-primary-primary-415284, #415284)',
    textAlign: 'center',
    /* Web/Body 14/Regular */
    fontSize: rem(14),
    fontWeight: 400,
    fontStyle: 'normal',
    background: 'var(--gray-ffffff, #FFF)',
    ':not([data-disabled]):hover': {
      background: 'var(--gray-ffffff, #FFF)',
    },
  },

  bannerCloseBtn: {
    justifyContent: 'flex-end',
    position: 'relative',
    top: rem(-10),
    right: `calc(-100% - ${rem(10)})`,
    width: 0,
    height: 0,
    button: {
      backgroundColor: 'white',
      border: `${rem(1)} solid #ccc`,
      borderRadius: rem(11),
    },
  },
}));

const Banner = ({
  type,
  title,
  content,
  action,
  onAction = () => {},
  onClose,
}: // btn_click_func: React.MouseEventHandler<HTMLButtonElement>
{
  type?: typeof userBannerType[keyof typeof userBannerType];
  title?: string;
  content: string;
  action: string;
  onAction?: () => void;
  onClose?: () => void;
}) => {
  const { classes, cx } = useStyles();

  return (
    <div className={classes.banner}>
      {onClose && (
        <Flex className={classes.bannerCloseBtn}>
          <CloseButton mr={0} mt={0} onClick={onClose} />
        </Flex>
      )}
      <Paper
        withBorder
        shadow="md"
        className={cx(
          classes[bannerTypeMap[type as number] as keyof typeof classes],
          classes.bannerContent,
        )}
      >
        <Flex className={classes.container}>
          <div style={{ flex: 1 }}>
            <Group position="apart" mb={6}>
              <Text fw={500} className={classes.title}>
                {title}
              </Text>
            </Group>
            <Text className={classes.content}>{content}</Text>
          </div>
          <Group position="right">
            <Button variant="filled" size="xs" className={classes.action} onClick={onAction}>
              {action}
            </Button>
          </Group>
        </Flex>
      </Paper>
    </div>
  );
};

export default Banner;
