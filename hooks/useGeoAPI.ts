import { useEffect, useState } from 'react';
import { useGetByCloudflareMutation } from '../store/services';

function useGeoAPI() {
  const [getByCloudflare] = useGetByCloudflareMutation();

  const [countryCode, setCountryCode] = useState('GB');
  const [isRunning, setIsRunning] = useState(true);

  const getCountryCode = async () => {
    getByCloudflare()
      .unwrap()
      .then((res: any) => {
        if (res?.trim) {
          const arr = res
            .trim()
            .split('\n')
            .map((e: any) => e.split('='));

          const obj = Object.fromEntries(arr);

          const countryCode = obj.loc;

          console.log('getCountryCode', countryCode);
          setCountryCode(countryCode);
          setIsRunning(false);
        }
      });
  };

  useEffect(() => {
    getCountryCode();
  }, []);

  return { countryCode, isRunning };
}

export default useGeoAPI;
