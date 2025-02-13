import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconChevronDown } from '@tabler/icons-react';
import OAMSelect, { OAMSelectProps } from '../base/Select';
import { getCountry } from '../../utils/location';
import { locationFilter } from '../../utils/filter.model';
import countryJson from '../../location/country.json';

interface LocationInputProps extends Omit<OAMSelectProps, 'data'> {
  hasLabel?: boolean;
  data?: { label: string; value: string }[];
}

export const LocationInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & LocationInputProps
>(({ hasLabel, label, placeholder, data, rightSection, dropdownPosition, ...props }, ref) => {
  const { t, i18n } = useTranslation();
  const [countryOptions, setCountryOptions] = useState<{ label: any; value: string }[]>([]);

  useEffect(() => {
    const options = countryJson.map((country) => getCountry(country));
    setCountryOptions(options);
  }, [t]);

  return (
    <OAMSelect
      required
      {...props}
      searchable
      label={hasLabel ? label || t('Location') : undefined}
      data={countryOptions}
      filter={locationFilter}
      placeholder={placeholder || t('Location').toString()}
      rightSection={rightSection || <IconChevronDown size="1rem" />}
      dropdownPosition={dropdownPosition || 'bottom'}
    />
  );
});

export default LocationInput;
