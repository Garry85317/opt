import { createSlice } from '@reduxjs/toolkit';
import { notificationApi } from '../../services';

export interface NotificationState {
  omsLicenseNotificationFlag: {
    isOAMExpired: boolean;
    oamExpireNotifyCloseTime: Date | null; //show at oam dashboard
    omsExpireNotifyCloseTime: Date | null; //show at oms dashboard
    isOAMUserExpried: boolean;
    isOAMUserUpgrade: boolean;
    isOAMDeviceExpried: boolean;
    isOAMDeviceUpgrade: boolean;
  };
  omsTrialExtensionNotification: {
    showOmsTrialExtensionDialog: boolean;
    descText: string;
    agreeOptionText: string;
    disagreeOptionText: string;
  };
  omsLicenseNotification: {
    willExpireTitleText: string;
    willExpireDescText: string;
  };
}

const initialState: NotificationState = {
  omsLicenseNotificationFlag: {
    isOAMExpired: false,
    oamExpireNotifyCloseTime: null,
    omsExpireNotifyCloseTime: null,
    isOAMUserExpried: false,
    isOAMUserUpgrade: false,
    isOAMDeviceExpried: false,
    isOAMDeviceUpgrade: false,
  },
  omsTrialExtensionNotification: {
    showOmsTrialExtensionDialog: false,
    descText: '',
    agreeOptionText: '',
    disagreeOptionText: '',
  },
  omsLicenseNotification: {
    willExpireTitleText: '',
    willExpireDescText: '',
  },
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(notificationApi.endpoints.getNotificationFlag.matchFulfilled, (state, action) => {
        state.omsLicenseNotificationFlag = action.payload.data;
      })
      .addMatcher(
        notificationApi.endpoints.getOMSTrialExtensionNotificationFlag.matchFulfilled,
        (state, action) => {
          state.omsTrialExtensionNotification = action.payload.data;
        },
      )
      .addMatcher(
        notificationApi.endpoints.getOMSlicenseNotification.matchFulfilled,
        (state, action) => {
          state.omsLicenseNotification = action.payload.data;
        },
      );
  },
});

export default notificationSlice.reducer;
