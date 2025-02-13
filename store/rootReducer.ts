import { AnyAction, combineReducers } from 'redux';
import {
  auth,
  account,
  organization,
  premium,
  users,
  devices,
  cloud,
  guardian,
  license,
  notificationSlice,
  geoSlice,
} from './slices';
import { api } from './services';
import type { ReduxState } from './index';

const combinedReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  account: account.reducer,
  auth: auth.reducer,
  cloud: cloud.reducer,
  organization: organization.reducer,
  premium: premium.reducer,
  users: users.reducer,
  devices: devices.reducer,
  guardian: guardian.reducer,
  license: license.reducer,
  notification: notificationSlice.reducer,
  geo: geoSlice.reducer,
});

export const reducer: typeof combinedReducer = (state: ReduxState, action: AnyAction) => {
  if (action.type === 'auth/clearAuthInfo') {
    // check for action type
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};
