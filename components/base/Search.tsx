import React, { MouseEventHandler } from 'react';
import { TextInput, TextInputProps, PasswordInputProps, rem, createStyles } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DefaultTFuncReturn } from 'i18next';
import { SearchBlackIcon, SearchGreyIcon, CloseIcon } from './icon';

interface OAMSearchInput extends TextInputProps, PasswordInputProps {
  classNames?: TextInputProps['classNames'] | PasswordInputProps['classNames'];
  styles?: TextInputProps['styles'] | PasswordInputProps['styles'];
  className?: string;
  required?: boolean;
  label?: DefaultTFuncReturn;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

type StyleSheet = Record<string, string | number>;

// const darkBlueColor = 'var(--b-2-b-primary-primary-415284, #415284)';
const blackColor = 'var(--gray-444444, #444)';
const grayColor = 'var(--gray-999999, #999)';
const borderColor = 'var(--gray-cccccc, #CCC)';
// const borderBottomColor = '#DDD';
const focusBorderColor = borderColor; //'var(--b-2-b-primary-variant-93-a-9-c-9, #93A9C9)';
const background = 'var(--gray-ffffff, #FFF)';
// const errorColor = 'var(--b-2-b-secondary-error-e-4002-b, #E4002B)';
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

const OAMSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & OAMSearchInput
>(
  (
    {
      type,
      visible,
      disabled,
      className,
      required,
      value,
      defaultValue,
      onChange,
      onClear,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const text = t('Search')!;
    const onClickIcon: MouseEventHandler<SVGSVGElement & HTMLDivElement & HTMLSpanElement> = (
      e,
    ) => {
      e.preventDefault();
      console.log(value);
      if (onClear) onClear();
    };

    return (
      <TextInput
        {...props}
        ref={ref}
        disabled={disabled}
        required={required}
        className={className}
        icon={value ? <SearchBlackIcon /> : <SearchGreyIcon />}
        rightSection={value ? <CloseIcon onClick={onClickIcon} /> : null}
        styles={{
          wrapper: {
            width: rem(260),
          },
          input: borderInputStyle,
          rightSection: {
            // pointerEvents: 'none', // will disable visibilityToggleIcon
            button: {
              color: borderColor,
              ':not([data-disabled]):hover, :focus, :focus-within': {
                color: focusBorderColor,
              },
              ':disabled': { opacity: 0.4, color: grayColor },
            },
          },
        }}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={text!}
      />
    );
  },
);

export default OAMSearchInput;
