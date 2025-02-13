import { useEffect } from 'react';

import { useLazyGetOrganizationUserQuery } from '../store/services';

export default function useOmsRole(accountId: string) {
  const [getOrganizationUser, getOrganizationUserStatus] = useLazyGetOrganizationUserQuery();
  useEffect(() => {
    accountId && getOrganizationUser({ accountId }, true);
  }, [accountId]);
  return getOrganizationUserStatus.data?.data?.omsRole || null;
}
