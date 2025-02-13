import { createListenerMiddleware, isAnyOf, addListener } from '@reduxjs/toolkit';
import type { TypedStartListening, TypedStopListening, TypedAddListener } from '@reduxjs/toolkit';
import { Matcher } from '@reduxjs/toolkit/dist/tsHelpers';
import { RehydrateAction, REHYDRATE } from 'redux-persist';
import type { ReduxState, ReduxDispatch } from './index';

import { authApi, userApi, premiumApi } from './services';
import { clearAuthInfo, setAuthInfo } from './actions';

export type AppStartListening = TypedStartListening<ReduxState, ReduxDispatch>;
export type AppStopListening = TypedStopListening<ReduxState, ReduxDispatch>;

// Create the middleware instance and methods
export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening as AppStartListening;

export const stopAppListening = listenerMiddleware.stopListening as AppStopListening;

export const addAppListener = addListener as TypedAddListener<ReduxState, ReduxDispatch>;

const getUserAction = userApi.endpoints.getUser.initiate;
const guardianConfirmStatusAction = userApi.endpoints.guardianConfirmStatus.initiate;
const premiumAnnounceAction = premiumApi.endpoints.premiumAnnounce.initiate;

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
startAppListening({
  // 1) Exact action type string match
  // type?: string
  // 2) Exact action type match based on the RTK action creator
  // actionCreator: authApi.internalActions.internal_probeSubscription,
  // 3) Match one of many actions using an RTK matcher
  matcher: isAnyOf(
    ((action: RehydrateAction) => action.type === REHYDRATE) as Matcher<RehydrateAction>,
  ),
  // 4) Return true based on a combination of action + state
  // predicate?: (action, currentState, previousState) => {
  // return true when the listener should run
  // },
  // The actual callback to run when the action is matched
  effect: async (_action, listenerApi) => {
    // Run whatever additional side-effect-y logic you want here
    // Can cancel other running instances
    // listenerApi.cancelActiveListeners();
    // Run async logic
    // Pause until action dispatched or state changed
    if (await listenerApi.condition(authApi.endpoints.transCode.matchPending)) {
      // Use the listener API methods to dispatch, get state,
      // unsubscribe the listener, start child tasks, and more
      listenerApi.unsubscribe();
      // Spawn "child tasks" that can do more work and return results
      const task = listenerApi.fork(async (forkApi) => {
        // Can pause execution
        await forkApi.delay(1);
        // Complete the child by returning a value
        return listenerApi.dispatch(clearAuthInfo());
      });

      const result = await task.result;
      // Unwrap the child result in the listener
      listenerApi.subscribe();
      // if (result.status === 'ok') {
      //   console.log('clearAuthInfo succeeded: ', result.value);
      // }
    }
  },
});

// trigger after login by any method for once
startAppListening({
  matcher: isAnyOf(setAuthInfo),
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await listenerApi.dispatch(getUserAction());
  },
});

startAppListening({
  matcher: isAnyOf(authApi.endpoints.transCode.matchFulfilled),
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    const { data } = action.payload;
    listenerApi.dispatch(setAuthInfo(data));
    await listenerApi.delay(1);
  },
});

// trigger after refresh any page for once
startAppListening({
  type: 'account/setUserInfo',
  effect: async (_action, listenerApi) => {
    listenerApi.unsubscribe();
    listenerApi.cancelActiveListeners();
    const { auth } = listenerApi.getState();
    if (auth.token && !auth?.hasRedirect) {
      await Promise.all([
        listenerApi.dispatch(premiumAnnounceAction()),
        // listenerApi.dispatch(guardianConfirmStatusAction()),
      ]);
    }
    listenerApi.subscribe();
  },
});
