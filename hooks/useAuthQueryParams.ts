import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function useAuthQueryParams() {
  const router = useRouter();
  const type = router.query.type as string;
  const state = router.query.state as string;

  useEffect(() => {
    if (router.isReady) {
      if (type === undefined) {
        localStorage.removeItem('signInFrom');
        localStorage.removeItem('signInState');
        return;
      }
      if (Array.isArray(type) || Array.isArray(state)) {
        localStorage.removeItem('signInFrom');
        localStorage.removeItem('signInState');
        return;
      }
      localStorage.setItem('signInFrom', type);
      console.log('fromType is: %s', state);

      if (state === undefined) {
        localStorage.removeItem('signInState');
      } else {
        localStorage.setItem('signInState', state);
      }

      console.log('signInState is: %s', type);
    }
  }, [router.isReady]);

  return { fromType: type, fromState: state };
}

export default useAuthQueryParams;
