import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ReduxState, ReduxDispatch } from './index';

/**
 * ? A utility function to create a typed Async Thunk Actions.
 */
export const createAppAsyncThunk =
  createAsyncThunk.withTypes<{
    state: ReduxState;
    dispatch: ReduxDispatch;
    // rejectValue: any;
  }>();
