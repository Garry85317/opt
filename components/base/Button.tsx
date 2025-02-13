import React from 'react';
import { Button, ButtonProps, rem, createStyles } from '@mantine/core';

export enum OAMButtonType {
  LIGHT_OUTLINE,
  DARK,
  LIGHT,
  NONE,
}

interface OAMButton extends ButtonProps {
  customType?: typeof OAMButtonType[keyof typeof OAMButtonType];
  // leftIcon: React.ReactNode;
  // className: string;
  // disabled?: boolean;
  // onClick?: React.MouseEventHandler<HTMLButtonElement>;
  // variant?: ButtonProps['variant'];
}

type StyleSheet = Record<string, string | number>;

const lightColor = 'var(--b-2-b-primary-primary-415284, #415284)';
const lightBackGround = 'var(--gray-ffffff, #FFF)';
const lightHoverBackground =
  'linear-gradient(0deg, rgba(147, 169, 201, 0.20) 0%, rgba(147, 169, 201, 0.20) 100%), #FFF';
const lightPressedBackground =
  'linear-gradient(0deg, rgba(147, 169, 201, 0.40) 0%, rgba(147, 169, 201, 0.40) 100%), #FFF';
const lightDisabledBackground = 'var(--gray-f-2-f-2-f-2, #F2F2F2)';
const darkColor = lightBackGround;
const darkBackground = lightColor;
const darkHoverBackground = 'var(--b-2-b-primary-variant-01256-b, #01256B)';
const darkPressedBackground = 'var(--gray-444444, #444)';
const darkDisabledBackground = lightColor;

function createButtonStyles(
  base: StyleSheet = {},
  hover: StyleSheet = {},
  pressed: StyleSheet = {},
  disabled: StyleSheet = {},
) {
  return {
    borderRadius: rem(18),
    fontSize: rem(14),
    fontStyle: 'normal',
    fontWeight: 400,
    ...base,
    ':not([data-disabled]):hover': hover,
    ':active': {
      transform: 'none', // translateY(0)
    },
    ':focus': { outline: 'none', ...pressed },
    ':disabled': { opacity: 0.4, ...disabled },
  };
}

const useStyles = createStyles(() => ({
  lightOutline: createButtonStyles(
    {
      color: lightColor,
      border: `1px solid ${lightColor}`,
      background: lightBackGround,
    },
    {
      background: lightHoverBackground,
    },
    {
      background: lightPressedBackground,
    },
    {
      background: lightDisabledBackground,
    },
  ),

  light: createButtonStyles(
    {
      color: lightColor,
      border: `1px solid ${lightBackGround}`,
      background: lightBackGround,
    },
    {
      border: `1px solid ${lightHoverBackground}`,
      background: lightHoverBackground,
    },
    {
      border: `1px solid ${lightPressedBackground}`,
      background: lightPressedBackground,
    },
    {
      border: `1px solid ${lightDisabledBackground}`,
      background: lightDisabledBackground,
    },
  ),

  dark: createButtonStyles(
    {
      color: darkColor,
      border: `1px solid ${darkBackground}`,
      background: darkBackground,
    },
    {
      border: `1px solid ${darkHoverBackground}`,
      background: darkHoverBackground,
    },
    {
      border: `1px solid ${darkPressedBackground}`,
      background: darkPressedBackground,
    },
    {
      color: darkColor,
      border: `1px solid ${darkDisabledBackground}`,
      background: darkDisabledBackground,
    },
  ),
}));

const OAMButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & OAMButton
>(
  (
    { customType = OAMButtonType.NONE, variant = 'default', className, children, ...props },
    ref,
  ) => {
    const { classes, cx } = useStyles();
    const classNameMap = {
      [OAMButtonType.LIGHT_OUTLINE]: classes.lightOutline,
      [OAMButtonType.DARK]: classes.dark,
      [OAMButtonType.LIGHT]: classes.light,
      [OAMButtonType.NONE]: '',
    };

    const styleClass = classNameMap[customType];
    return (
      <Button
        color="gray"
        ref={ref}
        {...props}
        className={cx(styleClass, className)}
        variant={variant}
      >
        {children}
      </Button>
    );
  },
);

export default OAMButton;
