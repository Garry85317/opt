import { createSlice } from '@reduxjs/toolkit';
import { geoApi } from '../../services';

export interface CloudflareInfo {
  geoData: {
    fl: string;
    h: string;
    ip: string;
    ts: string;
    visit_scheme: string;
    uag: string;
    colo: string;
    sliver: string;
    http: string;
    loc: string;
    tls: string;
    sni: string;
    warp: string;
    gateway: string;
    rbi: string;
    kex: string;
  };
}

const initialState: CloudflareInfo = {
  geoData: {
    fl: '',
    h: '',
    ip: '',
    ts: '',
    visit_scheme: '',
    uag: '',
    colo: '',
    sliver: '',
    http: '',
    loc: '',
    tls: '',
    sni: '',
    warp: '',
    gateway: '',
    rbi: '',
    kex: '',
  },
};

export const geoSlice = createSlice({
  name: 'geo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(geoApi.endpoints.getByCloudflare.matchFulfilled, (state, action) => {
      const response = action.payload;
      const responseData = response.split('\n').reduce((acc: any, line: string) => {
        const [key, value] = line.split('=');
        acc[key] = value;
        return acc;
      }, {});
      state.geoData = responseData;
    });
  },
});

export default geoSlice.reducer;
