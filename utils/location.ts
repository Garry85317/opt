import i18n from 'i18next';
import countryJson from '../location/country.json';
import stateJson from '../location/state.json';
import { IOrganization } from './types';

type Country = {
  id: number;
  name: {
    en: string;
    'zh-hant': string;
    [language: string]: string;
  };
  countrycode: string;
};

type State = {
  id: number;
  CountryCode: string;
  OdooStateName: string;
};

export const getCountry = ({ id, name, countrycode }: Country) => {
  const currentLanguage = i18n.language;
  const countryName = name[currentLanguage.toLowerCase()] || name.en;
  return {
    label: countryName,
    value: countrycode,
  };
};

export const getState = ({ id, CountryCode, OdooStateName }: State) => ({
  label: OdooStateName,
  value: OdooStateName,
});

export const country = countryJson
  .filter((country) => country.countrycode !== 'CN')
  .map(getCountry)
  .sort((a, b) => a.label.localeCompare(b.label));

export const state = stateJson
  .filter((state) => state.CountryCode !== 'CN')
  .map(getState)
  .sort((a, b) => a.label.localeCompare(b.label));

export const getCountryState = (countrycode: string) =>
  stateJson.filter(({ CountryCode }) => CountryCode === countrycode).map(getState);

export function getOrganizationLocation(organization: {
  state?: string;
  city?: string;
  country?: string;
  address?: string;
}) {
  const locationParams: string[] = [];
  if (organization.address !== '') locationParams.push(`${organization.address}`);
  if (organization.city !== '') locationParams.push(`${organization.city}`);
  if (organization.state !== '') locationParams.push(`${organization.state}`);
  if (organization.country !== '') {
    const organizationCountry = `${
      country.filter(
        ({ label, value }) => value === organization.country || label === organization.country,
      )[0]?.label || ''
    }`;
    locationParams.push(organizationCountry);
  }
  if (locationParams.length > 0) {
    return `${locationParams.join(', ')}`;
  }
  return '';
}

export function getLocation(prop: IOrganization) {
  const { address, country, state, city } = prop;
  return address.split(
    `${city ? `, ${city}` : ''}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`,
  )[0];
}
