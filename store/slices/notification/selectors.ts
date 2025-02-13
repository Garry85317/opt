import { createSelector } from '@reduxjs/toolkit';
import type { ReduxState } from '../../index';
import { NotificationState } from './slice';

export const selectLicenseNotification = createSelector(
  (state: ReduxState): NotificationState => state.notification,
  (notification) => notification.omsLicenseNotificationFlag,
);

export const selecOMSTrialExtensionNotification = createSelector(
  (state: ReduxState): NotificationState => state.notification,
  (notification) => notification.omsTrialExtensionNotification,
);

export const selectOMSLicenseNotification = createSelector(
  (state: ReduxState): NotificationState => state.notification,
  (notification) => notification.omsLicenseNotification,
);
