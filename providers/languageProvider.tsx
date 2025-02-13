import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useSelector } from '../store';
import i18n, { useLanguage } from '../i18n';
import { selectAccount } from '../store/slices';

const initialState = { language: i18n.language, changeLanguage: async () => undefined };

const PopupContext = createContext<ReturnType<typeof useLanguage>>(initialState);

export const useLanguageContext = () => useContext(PopupContext);

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const account = useSelector(selectAccount);
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    // Client-side-only
    if (typeof window !== undefined && window.localStorage) {
      // set language from localStorage to let menu display the correct language when the page is not logged in
      const storedLanguage = window.localStorage.getItem('i18nextLng');
      if (storedLanguage) {
        changeLanguage(storedLanguage);
      }
    }
  }, []);

  console.log({ language, account });
  useEffect(() => {
    if (!account.language || account.language === language) {
      return;
    }
    changeLanguage(account.language);
  }, [account.language]);

  return (
    <PopupContext.Provider value={{ language, changeLanguage }}>{children}</PopupContext.Provider>
  );
};

export default LanguageProvider;
