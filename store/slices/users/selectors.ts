import { createSelector } from '@reduxjs/toolkit';
import type { ReduxState } from '../../index';

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUsers = createSelector([(state: ReduxState) => state.users], (users) => {
  const {
    count,
    users: { ids, entities },
    omsUsersCount,
    ossUsersCount,
  } = users;
  return { users: ids.map((id: string) => entities[id]), count, omsUsersCount, ossUsersCount };
});
