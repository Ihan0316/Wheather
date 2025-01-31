import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  geolocation: { lat: 37.5665, lng: 126.978 },
};

const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState,
  reducers: {
    saveGeoCode: (state, action) => {
      return { ...state, geolocation: action.payload };
    },
  },
});

export const { saveGeoCode } = geolocationSlice.actions;
export default geolocationSlice;
