import React, { useState, forwardRef, useRef } from 'react';
import { ScrollArea, Select, SelectProps, createStyles, rem, Group, Tooltip } from '@mantine/core';
import Image from 'next/image';
import { DefaultTFuncReturn } from 'i18next';
import { useMergedRef } from '@mantine/hooks';
import clamp from 'lodash/clamp';
import DisableIcon from '../../public/images/drop-arrow-disable.svg';
import DownIcon from '../../public/images/drop-arrow-down.svg';
import UpIcon from '../../public/images/drop-arrow-up.svg';
import { ArrowUpIcon, ArrowDownIcon, ArrowDownDisabledIcon } from './icon';
import tooltipStyles from '../../style/tooltip';

export enum OAMSelectType {
  BORDER,
  LINE,
  SUBTLE,
}

export interface OAMSelectProps extends SelectProps {
  customType?: typeof OAMSelectType[keyof typeof OAMSelectType];
  className?: string;
  required?: boolean;
  label?: DefaultTFuncReturn;
  autoSelect?: boolean;
  autoMaxItems?: boolean;
  errorAlert?: boolean;
}

type StyleSheet = Record<string, string | number>;

const darkBlueColor = 'var(--b-2-b-primary-primary-415284, #415284)';
const blackColor = 'var(--gray-444444, #444)';
const grayColor = 'var(--gray-999999, #999)';
const borderColor = 'var(--gray-cccccc, #CCC)';
const borderBottomColor = '#DDD';
const focusBorderColor = 'var(--b-2-b-primary-variant-93-a-9-c-9, #93A9C9)';
const background = 'var(--gray-ffffff, #FFF)';
const itemBackground = 'var(--gray-f-2-f-2-f-2, #F2F2F2)';
const selectedBackground = 'var(--b-2-b-primary-variant-eaf-0-f-7, #EAF0F7)';
const errorColor = 'var(--b-2-b-secondary-error-e-4002-b, #E4002B)';
const labelColor = darkBlueColor;
const textColor = blackColor;

function createSelectStyles(base: StyleSheet, hover: StyleSheet, focus?: StyleSheet) {
  return {
    input: {
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
    },
  };
}

const useStyles = createStyles(() => ({
  border: {
    ...createSelectStyles(
      {
        borderRadius: rem(6),
        border: `1px solid ${borderColor}`,
        background,
      },
      {
        border: `1px solid ${focusBorderColor}`,
        background,
      },
      {
        color: blackColor,
        border: `1px solid ${focusBorderColor}`,
      },
    ),
    label: {
      marginBottom: rem(7),
    },
  },
  line: {
    ...createSelectStyles(
      {
        borderRadius: rem(0),
        border: 0,
        borderBottom: `1px solid ${borderBottomColor}`,
        background,
      },
      {
        border: 0,
        borderBottom: `1px solid ${focusBorderColor}`,
        background,
      },
      {
        color: blackColor,
        border: 0,
        borderBottom: `1px solid ${focusBorderColor}`,
      },
    ),
    label: {
      marginBottom: rem(1),
    },
  },
  subtle: {
    '.mantine-Select-wrapper': {
      marginBottom: 0,
    },
    'input:is([data-disabled])': {
      color: 'var(--gray-444444, #444)',
      background: 'none',
      opacity: 0.4,
    },
  },
}));

export type SelectItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
  tip?: string;
};

const renderSelectOption = (option: { label: string }) => <Group>{option.label}</Group>;

const OAMOption = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ tip, label, ...others }: SelectItemProps, ref) => {
    if (tip) {
      return (
        <div ref={ref} {...others}>
          <Tooltip label={tip} position="top" withinPortal styles={tooltipStyles()}>
            {renderSelectOption({ label })}
          </Tooltip>
        </div>
      );
    }
    return (
      <div ref={ref} {...others}>
        {renderSelectOption({ label })}
      </div>
    );
  },
);

const ITEM_HEIGHT = 36;
const DROPDOWN_PADDING = 8;
const MIN_DROPDOWN_ITEMS = 1.5;
const MAX_DROPDOWN_ITEMS = 5.5;

const OAMSelect = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & OAMSelectProps
>(
  (
    {
      customType = OAMSelectType.BORDER,
      disabled,
      className,
      required,
      label,
      value,
      defaultValue,
      data,
      error, // useForm hook error
      onChange,
      autoSelect,
      autoMaxItems,
      errorAlert, // custom error
      ...props
    },
    ref,
  ) => {
    const { classes, cx } = useStyles();
    const classNameMap = {
      [OAMSelectType.BORDER]: classes.border,
      [OAMSelectType.LINE]: classes.line,
      [OAMSelectType.SUBTLE]: classes.subtle,
    };
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const selectRef = useRef<HTMLInputElement>(null);
    const [dropdownItems, setDropdownItems] = useState(MAX_DROPDOWN_ITEMS);
    const styleClass = classNameMap[customType];
    const dropdownHeight = rem(data.length > 5 ? 200 : 192);
    const isOneOption = typeof data === 'string' || data.length <= 1;
    const subtleIcon =
      disabled || (autoSelect && isOneOption) ? (
        <ArrowDownDisabledIcon />
      ) : isDropdownOpen ? (
        <ArrowUpIcon />
      ) : (
        <ArrowDownIcon />
      );
    const icon = (
      <Image src={disabled ? DisableIcon : isDropdownOpen ? UpIcon : DownIcon} alt=">" />
    );

    const onDropdownOpen = () => {
      setIsDropdownOpen(true);

      const availableHeight =
        window.innerHeight - selectRef.current!.getBoundingClientRect().bottom;
      // 0.5 indicates there are more items for user to scroll
      const dropdownItems = Math.round((availableHeight - DROPDOWN_PADDING) / ITEM_HEIGHT) - 0.5;
      setDropdownItems(clamp(dropdownItems, MIN_DROPDOWN_ITEMS, MAX_DROPDOWN_ITEMS));
    };

    const dropdownPosition = props.dropdownPosition || 'bottom';
    return (
      <Select
        {...props}
        ref={useMergedRef(selectRef, ref)}
        dropdownComponent={React.forwardRef((dropdownProps: any, _ref) => (
          <ScrollArea.Autosize
            ref={_ref}
            {...dropdownProps}
            scrollbarSize={8}
            styles={{
              root: {
                maxHeight: autoMaxItems
                  ? rem(dropdownItems * ITEM_HEIGHT + DROPDOWN_PADDING)
                  : dropdownHeight,
                flex: 1,
              },
              scrollbar: {
                '&, &:hover': {
                  color: '#fff',
                },
                '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                  backgroundColor: 'var(--gray-dddddd, #DDD)',
                },
              },
            }}
          />
        ))}
        disabled={disabled || (autoSelect && isOneOption)}
        required={required}
        className={cx(styleClass, className)}
        label={label}
        dropdownPosition={dropdownPosition}
        rightSection={customType === OAMSelectType.SUBTLE ? subtleIcon : icon}
        // withinPortal
        styles={{
          root: {
            marginBottom: (props.mb as string | number) || rem(16),
          },
          input: { color: error ? errorColor : blackColor },
          label: { color: labelColor },
          wrapper: {
            marginBottom: error ? rem(4) : (props.mb as string | number) || rem(16),
          },
          dropdown: {
            marginTop: rem(dropdownPosition === 'bottom' ? -8 : 8), // cancel inline top offset
            borderRadius: rem(6),
            border: `1px solid ${borderColor}`,
            background,
          },
          item: {
            height: rem(ITEM_HEIGHT),
            borderRadius: rem(4),
            color: blackColor,
            ':is([data-hovered])': {
              background: itemBackground,
            },
            ':is([data-selected])': {
              color: darkBlueColor,
              background: selectedBackground,
            },
            ':is([data-selected]):hover': {
              background: itemBackground,
            },
          },
          rightSection: { pointerEvents: 'none' },
          error: {
            color: errorColor,
            lineHeight: rem(12),
          },
        }}
        value={
          !value && autoSelect ? (typeof data[0] === 'string' ? data[0] : data[0].value) : value
        }
        defaultValue={defaultValue}
        data={data}
        onChange={onChange}
        onDropdownOpen={onDropdownOpen}
        onDropdownClose={() => setIsDropdownOpen(false)}
        autoComplete="no-autofill" //https://ithelp.ithome.com.tw/questions/10214084
        itemComponent={OAMOption}
        error={errorAlert}
      />
    );
  },
);

export default OAMSelect;
