import { createSelector } from '@reduxjs/toolkit';
import type { ReduxState } from '../../index';
import { OMSInfoResponse, OSSInfoResponse } from '../../../utils/types';

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectLicense = createSelector(
  [(state: ReduxState) => state.license],
  (
    license,
  ): {
    oms: OMSInfoResponse['data'];
    oss: OSSInfoResponse['data'];
  } => license,
);
