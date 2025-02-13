import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from '../store';
import { selectOmsInfo } from '../store/slices';
import { useLazyExchangeTokenQuery, useGetExpiryMutation } from '../store/services';
import { ExchangeTokenResponse } from '../utils/types';

function useExchangeToken() {
  const { token: csrfToken } = useSelector(selectOmsInfo);
  const expired = useRef(dayjs().unix());
  const setNullInterval = setInterval(() => {}, 0);
  const timer = useRef(setNullInterval);
  const [exchangeToken, status] = useLazyExchangeTokenQuery();
  const [getExpiry, getExpiryStatus] = useGetExpiryMutation();
  const [tokenInfo, setTokenInfo] = useState<ExchangeTokenResponse['data']['data']>({
    token: csrfToken as string,
    isCompletedAccountInfo: true,
  });

  const initToken = async () => {
    console.log('initToken');
    await exchangeToken({
      omsAccountInfo: { isMarketingPromo: false },
    })
      .unwrap()
      .then((data: ExchangeTokenResponse) => {
        if (data?.data.data) setTokenInfo(data.data.data);
      });
  };
  const refreshToken = async () => {
    console.log('refreshToken');
    if (expired.current <= dayjs().unix()) {
      await getExpiry().unwrap();
      // refreshToken over 10 min later
      expired.current = dayjs().add(10, 'minute').unix();
    }
  };

  useEffect(() => {
    if (csrfToken) refreshToken();
  }, [csrfToken]);

  useEffect(() => {
    console.log('setInterval');
    // check refreshToken every 1 min
    timer.current = setInterval(refreshToken, 1 * 60 * 1000);

    return () => {
      if (timer.current) {
        console.log('clearInterval');
        clearInterval(timer.current);
      }
    };
  }, []);

  useEffect(() => {
    initToken();
  }, []);

  return {
    tokenInfo,
    ...status,
    isLoading: status.isLoading || getExpiryStatus.isError,
    isSuccess: status.isSuccess || Boolean(csrfToken),
  };
}

export default useExchangeToken;
