import React from 'react';
import { Checkbox, CheckboxProps, createStyles, rem } from '@mantine/core';
import { CheckedIcon, IndeterminateIcon } from './icon';

interface OAMCheckbox extends CheckboxProps {}

const darkBlueColor = 'var(--b-2-b-primary-primary-415284, #415284)';

const useStyles = createStyles(() => ({
  input: {
    display: 'flex',
    justifyContent: 'center',
    'input:checked': {
      background: darkBlueColor,
      borderColor: darkBlueColor,
    },
    '.mantine-Checkbox-icon': {
      width: '100%',
      div: {
        display: 'block',
        width: '100%',
        height: '100%',
      },
      svg: {
        width: rem(28),
        height: rem(28),
        position: 'absolute',
        left: `calc(50% - ${rem(28 / 2)})`,
        top: `calc(50% - ${rem(28 / 2)})`,
      },
    },
  },
}));

const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, className }) =>
  indeterminate ? (
    <IndeterminateIcon data-testid="indeterminate-icon" className={className} />
  ) : (
    <CheckedIcon data-testid="checked-icon" className={className} />
  );

const OAMCheckbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & OAMCheckbox
>(({ className, icon, checked, indeterminate, onChange, ...props }, ref) => {
  const { classes, cx } = useStyles();

  return (
    <Checkbox
      {...props}
      ref={ref}
      className={cx(classes.input, className)}
      icon={CheckboxIcon}
      transitionDuration={0}
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
    />
  );
});

export default OAMCheckbox;
