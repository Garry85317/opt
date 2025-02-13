import type { ReduxState } from '../../index';

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAccessToken = (state: ReduxState) => state.auth.token;
export const selectHasRedirect = (state: ReduxState) => state.auth.hasRedirect;
export const selectRedirectUrl = (state: ReduxState) => state.auth.redirectUrl;
export const selectAccountId = (state: ReduxState) => state.auth.accountId;
