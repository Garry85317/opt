import React from 'react';
import { TextInput, PasswordInput, TextInputProps, PasswordInputProps, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DefaultTFuncReturn } from 'i18next';
import { PasswordHideIcon as Hide, PasswordShowIcon as Show } from './icon';

export enum OAMTextInputType {
  BORDER,
  LINE,
}

interface OAMTextInput extends TextInputProps, PasswordInputProps {
  classNames?: TextInputProps['classNames'] | PasswordInputProps['classNames'];
  styles?: TextInputProps['styles'] | PasswordInputProps['styles'];
  customType?: typeof OAMTextInputType[keyof typeof OAMTextInputType];
  className?: string;
  required?: boolean;
  label?: DefaultTFuncReturn;
}

type StyleSheet = Record<string, string | number>;

const darkBlueColor = 'var(--b-2-b-primary-primary-415284, #415284)';
const blackColor = 'var(--gray-444444, #444)';
const grayColor = 'var(--gray-999999, #999)';
const borderColor = 'var(--gray-cccccc, #CCC)';
const borderBottomColor = '#DDD';
const focusBorderColor = 'var(--b-2-b-primary-variant-93-a-9-c-9, #93A9C9)';
const background = 'var(--gray-ffffff, #FFF)';
const errorColor = 'var(--b-2-b-secondary-error-e-4002-b, #E4002B)';
const labelColor = darkBlueColor;
const textColor = blackColor;

function createInputStyles(base: StyleSheet, hover: StyleSheet, focus?: StyleSheet) {
  return {
    fontSize: rem(14),
    fontWeight: 400,
    color: textColor,
    ...base,
    ':not([data-disabled]):hover': hover,
    ':active': {
      transform: 'none', // translateY(0)
    },
    ':focus': focus || base,
    ':focus-within': focus || base,
    ':disabled': { opacity: 0.4, color: grayColor },
    ':is([data-invalid]), :is([data-invalid]):hover': {
      color: blackColor,
      borderColor: errorColor,
    },
  };
}

const borderInputStyle = createInputStyles(
  {
    // color: textColor,
    borderRadius: rem(6),
    border: `1px solid ${borderColor}`,
    background,
  },
  {
    // color: darkBlueColor,
    border: `1px solid ${focusBorderColor}`,
    background,
  },
  {
    color: blackColor,
    border: `1px solid ${focusBorderColor}`,
  },
);
const lineInputStyle = createInputStyles(
  {
    // color: textColor,
    borderRadius: rem(0),
    border: 0,
    borderBottom: `1px solid ${borderBottomColor}`,
    background,
  },
  {
    // color: darkBlueColor,
    border: 0,
    borderBottom: `1px solid ${focusBorderColor}`,
    background,
  },
  {
    color: blackColor,
    border: 0,
    borderBottom: `1px solid ${focusBorderColor}`,
  },
);

const OAMTextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & OAMTextInput
>(
  (
    {
      customType = OAMTextInputType.BORDER,
      type,
      visible,
      disabled,
      className,
      required,
      label,
      value,
      defaultValue,
      onChange,
      onVisibilityChange,
      error,
      ...props
    },
    ref,
  ) => {
    const inputStyleMap = {
      [OAMTextInputType.BORDER]: borderInputStyle,
      [OAMTextInputType.LINE]: lineInputStyle,
    };
    const [opened, { toggle }] = useDisclosure(visible);

    const render = (Component: typeof PasswordInput | typeof TextInput) => {
      const visibleProps =
        type === 'password'
          ? {
              visibilityToggleIcon: ({
                reveal,
                size,
              }: {
                reveal: boolean;
                size: number | string;
              }) => (reveal ? <Hide /> : <Show />),
              visibilityToggleLabel: 'visible',
              visible: visible || opened,
              onVisibilityChange: onVisibilityChange || toggle,
            }
          : {};
      return (
        <Component
          {...props}
          {...visibleProps}
          ref={ref}
          disabled={disabled}
          required={required}
          className={className}
          label={label}
          styles={{
            label: {
              color: labelColor,
              marginBottom: customType === OAMTextInputType.LINE ? rem(1) : rem(7),
            },
            wrapper: {
              marginBottom: error ? rem(4) : rem(16),
            },
            input: inputStyleMap[customType],
            innerInput: {
              ':is([data-invalid]), :is([data-invalid]):hover': {
                color: blackColor,
                borderColor: 'transparent',
              },
            },
            rightSection: {
              // pointerEvents: 'none', // will disable visibilityToggleIcon
              button: {
                color: error ? errorColor : borderColor,
                ':not([data-disabled]):hover, :focus, :focus-within': {
                  color: error ? errorColor : focusBorderColor,
                },
                ':disabled': { opacity: 0.4, color: grayColor },
                ':is([data-invalid]), :is([data-invalid]):hover': {
                  color: blackColor,
                  borderColor: errorColor,
                },
              },
            },
            error: {
              color: errorColor,
              lineHeight: rem(12),
            },
          }}
          value={value}
          onChange={onChange}
          error={error || ''}
        />
      );
    };

    return (
      <>
        {type === 'password' && render(PasswordInput)}
        {type === 'password' || render(TextInput)}
      </>
    );
  },
);

export default OAMTextInput;
