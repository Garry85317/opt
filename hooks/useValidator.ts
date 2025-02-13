import { hasLength, isEmail, matches, UseFormReturnType } from '@mantine/form';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

function useValidator() {
  const { t } = useTranslation();

  const validateUsername = useCallback(
    (value: string) => {
      const invalidMessage = t('At_least_a_to_b_characters', { min: 3, max: 70 }) as string;
      const checkLength = hasLength({ min: 3, max: 70 }, invalidMessage);
      // const checkUppercase = matches(/(?=.*[A-Z])/, invalidMessage);
      // const checkLowercase = matches(/(?=.*[a-z])/, invalidMessage);
      // const checkNumber = matches(/(?=.*\d)/, invalidMessage);
      const disallowedCharacters = /(?=.*[!@#$%^&*()\-=¡£_+`~.,<>/?;:'"\\|[\]{}])/;
      const validated = checkLength(value);
      if (validated) return validated;
      if (
        (value as string).trim() === '' ||
        new RegExp(disallowedCharacters).test(value as string)
      ) {
        return t('No_special_character') as string;
      }
      return null;
    },
    [t],
  );

  const validateNFC = matches(/(^[0-9]*$)/, `${t('Invalid_NFC')} `);

  return { validateUsername, validateNFC };
}

export default useValidator;
