import { createSlice } from '@reduxjs/toolkit';
import type { IAccount } from '../../../utils/types';
import { setUserInfo } from '../../actions';
import { userApi } from '../../services';
import { DEFAULT_DATE_TEMPLATE } from '../../../utils/date';

const initialState: IAccount = {
  id: '',
  accountId: '',
  name: '',
  email: '',
  timezone: '',
  language: '',
  formatDate: DEFAULT_DATE_TEMPLATE,
  platform: '',
  provider: 'oam',
  avatar: '',
  isAutoLogout: false,
  deviceGoogleAccount: '',
};

export const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // handle state changes with pure functions
    userLogout: () => initialState,
    setDateFormat: (state, action) => {
      state.formatDate = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(setUserInfo, (state, action) => {
      Object.entries(action.payload).forEach(([k, v]) => {
        (state[k as keyof IAccount] as any) = v;
      });
    });
  },
});

// Action creators are generated for each case reducer function
export const { userLogout, setDateFormat } = account.actions;

export default account.reducer;
