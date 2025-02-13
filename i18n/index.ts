import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { useCallback, useState } from 'react';
import cs from './cs-CZ.json';
import de from './de-DE.json';
import en from './en-US.json';
import es from './es-ES.json';
import fr from './fr-FR.json';
import it from './it-IT.json';
import ko from './ko-KR.json';
import nl from './nl-NL.json';
import pl from './pl-PL.json';
import pt from './pt-BR.json';
import ro from './ro-RO.json';
import ru from './ru-RU.json';
import tr from './tr-TR.json';
import zhCN from './zh-CN.json';
import zhTW from './zh-TW.json';
import ja from './ja.json';
import el from './el.json';
import hu from './hu.json';
import nb from './nb.json';
import da from './da.json';
import fi from './fi.json';
import sv from './sv.json';
import vi from './vi.json';
import ar from './ar.json';
import fa from './fa.json';

const resources = {
  cs: {
    translation: cs,
  },
  de: {
    translation: de,
  },
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  it: {
    translation: it,
  },
  ko: {
    translation: ko,
  },
  nl: {
    translation: nl,
  },
  pl: {
    translation: pl,
  },
  pt: {
    translation: pt,
  },
  ro: {
    translation: ro,
  },
  ru: {
    translation: ru,
  },
  tr: {
    translation: tr,
  },
  'zh-Hans': {
    translation: zhCN,
  },
  'zh-Hant': {
    translation: zhTW,
  },
  ja: {
    translation: ja,
  },
  el: {
    translation: el,
  },
  hu: {
    translation: hu,
  },
  nb: {
    translation: nb,
  },
  da: {
    translation: da,
  },
  fi: {
    translation: fi,
  },
  sv: {
    translation: sv,
  },
  vi: {
    translation: vi,
  },
  ar: {
    translation: ar,
  },
  fa: {
    translation: fa,
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'languageDetector',
  lookup(options) {
    // options -> are passed in options
    if (typeof window === 'undefined') return 'en';
    const localStorageLang =
      options.lookupLocalStorage && window.localStorage
        ? window.localStorage.getItem(options.lookupLocalStorage)
        : undefined;
    const navigatorLang = window.navigator.language.toLowerCase();
    const navigatorMappedLang = navigatorLang === 'zh-tw' ? 'zh-hant' : navigatorLang;
    return localStorageLang || navigatorMappedLang || 'en';
  },
  cacheUserLanguage(lng, options) {
    // options -> are passed in options
    // lng -> current language, will be called after init and on changeLanguage
    // store it
    if (typeof window === 'undefined') return;
    if (options.lookupLocalStorage) {
      window.localStorage.setItem(options.lookupLocalStorage, lng.toLowerCase());
    } else {
      window.localStorage.setItem('i18nextLng', 'en');
    }
  },
});

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    supportedLngs: Object.keys(resources),
    detection: {
      order: [
        'languageDetector',
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
      ],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => lng.toLowerCase(),
    },
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((err) => {
    console.log(err);
  });

export const useLanguage = () => {
  const [language, setLanguage] = useState('');

  const changeLanguage = useCallback((lang: string) => {
    setLanguage(lang.toLowerCase());
    i18n.changeLanguage(lang.toLowerCase());
  }, []);

  return { language, changeLanguage };
};

export default i18n;
