import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconChevronDown } from '@tabler/icons-react';
import OAMSelect, { OAMSelectProps } from '../base/Select';
import { state, getCountryState } from '../../utils/location';

interface StateInput extends Omit<OAMSelectProps, 'data'> {
  hasLabel?: boolean;
  location?: string;
  data?: { label: string; value: string }[];
  error?: string;
}
export const StateInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & StateInput
>(
  (
    { hasLabel, location, label, placeholder, data, rightSection, dropdownPosition, ...props },
    ref,
  ) => {
    const { t } = useTranslation();

    return (
      <OAMSelect
        // required
        {...props}
        searchable
        label={hasLabel ? label || t('State') : undefined}
        data={location ? getCountryState(location) : state}
        // data-autofocus
        placeholder={placeholder || t('State').toString()}
        rightSection={rightSection || <IconChevronDown size="1rem" />}
        dropdownPosition={dropdownPosition || 'bottom'}
      />
    );
  },
);
