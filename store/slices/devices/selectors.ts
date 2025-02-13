import { createSelector } from '@reduxjs/toolkit';
import type { ReduxState } from '../../index';

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectDevices = createSelector([(state: ReduxState) => state.devices], (devices) => {
  const {
    devices: { ids, entities },
  } = devices;
  return ids?.map((id: string) => entities[id]);
});

export const selectOmsInfo = createSelector([(state: ReduxState) => state.devices], (devices) => {
  const { token, licenseInfo, omsId, maxPageIndex, totalCount } = devices;
  return { token, licenseInfo, omsId, maxPageIndex, totalCount };
});
