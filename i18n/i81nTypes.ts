export const supportedLangs = [
  'cs',
  'pl',
  'tr',
  'ro',
  'ko',
  'de',
  'en',
  'es',
  'fr',
  'it',
  'nl',
  'pt',
  'ru',
  'zh-hant',
  'zh-hans',
  'ja',
  'el',
  'hu',
  'nb',
  'da',
  'fi',
  'sv',
  'vi',
  'ar',
  'fa',
] as const;
export type LangType = typeof supportedLangs[number];

export const SUPPORTED_LANGUAGES: Array<{
  label: string;
  value: LangType;
}> = [
  { label: 'English', value: 'en' },
  { label: '繁體中文', value: 'zh-hant' },
  { label: '简体中文', value: 'zh-hans' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Italiano', value: 'it' },
  { label: 'Español', value: 'es' },
  { label: 'Português', value: 'pt' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: 'Nederlands', value: 'nl' },
  { label: 'Polski', value: 'pl' },
  { label: 'Русский', value: 'ru' },
  { label: 'Čeština', value: 'cs' },
  { label: 'Türkçe', value: 'tr' },
  { label: 'ελληνικά', value: 'el' },
  { label: 'Magyar', value: 'hu' },
  { label: 'Norsk', value: 'nb' },
  { label: 'Dansk', value: 'da' },
  { label: 'Suomi', value: 'fi' },
  { label: 'Svenska', value: 'sv' },
  { label: 'Tiếng Việt (越南語)', value: 'vi' },
  { label: 'عربي', value: 'ar' },
  { label: 'فارسی', value: 'fa' },
  { label: 'Romania', value: 'ro' },
];

export function detectLanguage() {
  const languages = SUPPORTED_LANGUAGES.filter(
    (lang) => window?.navigator.languages.filter((language) => lang.value === language)[0],
  );
  return languages[0].value;
}
