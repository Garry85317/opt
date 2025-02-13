import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
export const timeFormats = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY/MM/DD',
  'DD.MM.YYYY',
  'YYYY-MM-DD',
  // 'Month DD, YYYY', // MMMM DD, YYYY
  // 'Mon DD, YYYY', // MMM DD, YYYY
  // 'DD Month YYYY', // DD MMMM YYYY
  // 'DD Mon YYYY', // DD MMM YYYY
];

export const timeFormatOptions = timeFormats.map((format) => ({ label: format, value: format }));

export const DEFAULT_DATE_TEMPLATE = 'DD/MM/YYYY';
export const formatToDate = (date: string, template: string = DEFAULT_DATE_TEMPLATE) => {
  const trimmedTemplate = template.trim();
  const isValidTemplate = trimmedTemplate && timeFormats.includes(trimmedTemplate);
  const finalTemplate = isValidTemplate ? trimmedTemplate : DEFAULT_DATE_TEMPLATE;

  const formattedDate = dayjs.utc(date, 'DD/MM/YYYY');
  if (formattedDate.isValid()) {
    return formattedDate.format(finalTemplate);
  }

  const formattedDate2 = dayjs.utc(date);
  return formattedDate2.isValid() ? formattedDate2.format(finalTemplate) : date;
};
