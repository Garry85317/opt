import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IOrganization } from '../../../utils/types';
import { setOrganization } from '../../actions';

const initialState: IOrganization = {
  id: '',
  name: '',
  type: '',
  country: '',
  city: '',
  state: '', // zip
  address: '',
  phone: '',
  createdAt: null,
};

export const organization = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    // handle state changes with pure functions
    userOrganLogout: (state, action: PayloadAction<void>) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(setOrganization, (state, action: PayloadAction<IOrganization>) => {
      Object.entries(action.payload).forEach(([k, v]) => {
        state[k as keyof IOrganization] = v;
      });
    });
  },
});

// Action creators are generated for each case reducer function
export const { userOrganLogout } = organization.actions;

export default organization.reducer;
