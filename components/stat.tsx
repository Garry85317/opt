import React from 'react';
import { Flex, Text, rem, createStyles } from '@mantine/core';
import OAMAnchor, { OAMAnchorType } from './base/Anchor';
import { capitalizeFirstLetter } from '../utils/text';

type Size = {
  width?: string | number;
  height?: string | number;
};

type Stat = {
  name: string;
  value?: string;
  isNormal?: boolean;
  action?: React.ReactNode;
  onAction?: () => void;
  description: React.ReactNode;
};

type Stats = {
  name: string;
  value: string;
  isNormal?: boolean;
  actions?: React.ReactNode[];
  onActions?: (() => void)[];
  description?: React.ReactNode;
};

const useStyles = createStyles((_theme, size: Size) => ({
  root: {
    width: size.width,
    height: size.height,
    padding: rem(16),
    flex: 1,
  },
  action: {
    textAlign: 'right',
    fontSize: rem(14),
    fontWeight: 400,
    ':not(:last-child)': {
      marginRight: rem(4),
    },
  },
  value: {
    color: 'var(--gray-444444, #444)',
    fontSize: rem(24),
    fontWeight: 500,
  },
  abnormal: {
    color: 'var(--b-2-b-secondary-error-e-4002-b, #E4002B)',
  },
}));

export default function StatGrid({
  width = '100%',
  height = rem(90),
  isNormal = true,
  ...props
}: (Stat | Stats) & Size) {
  const { classes, cx } = useStyles({ width, height });

  return (
    <Flex className={classes.root} direction="column" justify="space-between">
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 'auto' }}>{props.name}</div>
        {'actions' in props ? (
          props.actions!.map((node, index) => (
            <OAMAnchor
              key={`#${index}`}
              customType={OAMAnchorType.BLUE}
              component="button"
              type="button"
              className={classes.action}
              onClick={() => (props.onActions as unknown as (() => void)[])![index]()}
            >
              {node}
            </OAMAnchor>
          ))
        ) : 'action' in props ? (
          <OAMAnchor
            customType={OAMAnchorType.BLUE}
            component="button"
            type="button"
            className={classes.action}
            onClick={() => props.onAction!()}
          >
            {props.action}
          </OAMAnchor>
        ) : null}
      </div>
      {props.value && (
        <Text className={cx(classes.value, !isNormal ? classes.abnormal : '')}>
          {`${capitalizeFirstLetter(props.value)}`}
        </Text>
      )}
      {props.description}
    </Flex>
  );
}
