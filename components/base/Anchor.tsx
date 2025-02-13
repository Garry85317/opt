import React, { ComponentProps, ElementType } from 'react';
import { Anchor, AnchorProps, createStyles, rem } from '@mantine/core';

export enum OAMAnchorType {
  BLUE,
  RED,
  BLACK,
}

interface OAMAnchor extends AnchorProps {
  component?: ComponentProps<ElementType>;
  customType?: typeof OAMAnchorType[keyof typeof OAMAnchorType];
  onClick?: () => void;
}

type StyleSheet = Record<string, string | number>;

const blueColor = 'var(--b-2-b-secondary-465-ee-3, #465EE3)';
export const darkBlueColor = 'var(--b-2-b-primary-primary-415284, #415284)';
const redColor = 'var(--b-2-b-secondary-error-e-4002-b, #E4002B)';
const blackColor = 'var(--gray-444444, #444)';

function createAnchorStyles(base: StyleSheet, hoverColor: string) {
  return {
    fontSize: rem(14),
    fontWeight: 400,
    textDecorationLine: 'underline',
    ...base,
    ':not([data-disabled]):hover': { color: hoverColor },
    ':active': {
      transform: 'none', // translateY(0)
    },
    ':focus': { color: hoverColor },
    ':disabled': { opacity: 0.4, color: 'var(--gray-999999, #999)' },
  };
}

const useStyles = createStyles(() => ({
  blue: createAnchorStyles(
    {
      color: blueColor,
    },
    darkBlueColor,
  ),
  red: createAnchorStyles(
    {
      color: redColor,
    },
    blackColor,
  ),
  black: createAnchorStyles(
    {
      color: blackColor,
    },
    blueColor,
  ),
}));

const OAMAnchor = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & OAMAnchor
>(({ customType = OAMAnchorType.BLUE, className, onClick, children, component, ...props }, ref) => {
  const { classes, cx } = useStyles();
  const classNameMap = {
    [OAMAnchorType.BLUE]: classes.blue,
    [OAMAnchorType.RED]: classes.red,
    [OAMAnchorType.BLACK]: classes.black,
  };
  const styleClass = classNameMap[customType];

  return (
    <Anchor
      {...props}
      ref={ref}
      component={component}
      className={cx(styleClass, className)}
      onClick={onClick}
    >
      {children}
    </Anchor>
  );
});

export default OAMAnchor;
