import { isEmail, UseFormReturnType } from '@mantine/form';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function useEmailQuery(form: UseFormReturnType<any>) {
  const { t } = useTranslation();
  const router = useRouter();
  const email = router.query.email as string;

  useEffect(() => {
    if (email && !isEmail(t('Invalid_email'))(email)) {
      form.setFieldValue('email', email as string);
    }
  }, [router.query]);
}

export default useEmailQuery;
