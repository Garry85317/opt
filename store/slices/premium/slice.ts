import { createSlice } from '@reduxjs/toolkit';
import { premiumApi } from '../../services';

const omsFeatures = [
  'Free access to all advanced features',
  'Experience seamless connectivity between local devices and cloud management with the secure "Hybrid Gateway" feature.',
  'Easily manage subscription plans in the future with Optoma MyAccount.',
];
const ossFeatures = [
  'Discover OSS features: Whiteboard for on-site and remote collaboration, and Display Share for seamless wireless cooperation.',
  'Utilize the Whiteboard and Screen Sharing to enhance engagement and communication during your sessions.',
];
const initialState = {
  isModalVisible: false,
  description: {
    oms: omsFeatures,
    oss: ossFeatures,
  },
  endDate: {
    oms: '',
    oss: '',
  },
};

export const premium = createSlice({
  name: 'premium',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalVisible = true;
    },
    closeModal: (state) => {
      state.isModalVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(premiumApi.endpoints.premiumAnnounce.matchFulfilled, (state, action) => {
        state.isModalVisible = action.payload.data.oam;
        if (action.payload.data?.description) state.description = action.payload.data.description;
        if (action.payload.data?.endDate) {
          state.endDate = action.payload.data.endDate;
        }
      })
      .addMatcher(premiumApi.endpoints.premiumAnnounce.matchRejected, (state) => {
        console.log(state);
      });
  },
});

export const { openModal, closeModal } = premium.actions;
export default premium.reducer;
