import { useCallback } from 'react';
import type { TFunction } from 'i18next';

import type { RoleItem } from '../utils/role';

export default function useRoleOptionsTranslation(
  t: TFunction<'translation', undefined, 'translation'>,
) {
  const roleOptionsTranslator = useCallback(
    (roles: RoleItem[]) =>
      roles.map((role) => ({
        ...role,
        label: t(role.label),
        tip:
          role.tip &&
          (role.tip === 'If_you_want_to_assign_role_to_OMS'
            ? t(role.tip, { role: t(role.label) })
            : t(role.tip)),
      })),
    [t],
  );
  return roleOptionsTranslator;
}
