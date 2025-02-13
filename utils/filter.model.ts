import { SelectItem } from '@mantine/core';

export const timezoneFilter = (value: string, item: SelectItem) =>
  item.label?.toLowerCase().includes(value.toLowerCase()) || false;

export const locationFilter = (value: string, item: SelectItem) =>
  item.label?.toLowerCase().startsWith(value.toLowerCase()) || false;
