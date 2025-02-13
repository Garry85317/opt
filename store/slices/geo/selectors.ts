import { createSelector } from '@reduxjs/toolkit';
import type { ReduxState } from '../../index';
import { CloudflareInfo } from './slice';

export const selectGeo = createSelector(
  (state: ReduxState): CloudflareInfo => state.geo,
  (geo) => geo.geoData,
);
