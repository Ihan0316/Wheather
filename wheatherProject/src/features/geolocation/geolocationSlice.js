import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  geolocation: { lat: 35.1652, lng: 129.043 },
};

const geolocationSlice = createSlice({
  name: "geolocation",
  initialState,
  reducers: {
    saveGeoCode: (state, action) => {
      return { ...state, geolocation: action.payload };
    },
  },
});

export const { saveGeoCode } = geolocationSlice.actions;
export default geolocationSlice;
