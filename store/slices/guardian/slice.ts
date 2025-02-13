import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { userApi } from '../../services';

const initialState = {
  childEmail: '',
  guardianEmail: '',
  approved: true,
  closed: false,
};

export const guardian = createSlice({
  name: 'guardian',
  initialState,
  reducers: {
    closeGuardian: (state, action: PayloadAction<void>) => {
      state.closed = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.guardianConfirmStatus.matchFulfilled, (state, action) => {
        const { data } = action.payload;
        state.childEmail = data.child_email;
        state.guardianEmail = data.guardian_email;
        state.approved = data.approved;
      })
      .addMatcher(userApi.endpoints.sendGuardianConfirm.matchFulfilled, (state, action) => {
        state.approved = true;
      });
  },
});

export const { closeGuardian } = guardian.actions;
export default guardian.reducer;
