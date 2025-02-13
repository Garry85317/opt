import { createSelector } from '@reduxjs/toolkit';
import type { ReduxState } from '../../index';
import { PairType } from '../../../utils/types';

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCloud = createSelector([(state: ReduxState) => state.cloud], (cloud) => {
  const { google_drive, google_classroom, one_drive } = cloud;

  return {
    [PairType.GoogleDrive]: google_drive.email,
    [PairType.GoogleClassroom]: google_classroom.email,
    [PairType.OneDrive]: one_drive.email,
  };
});
