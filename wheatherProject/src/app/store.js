// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "../features/search/searchSlice";
import geolocationSlice from "../features/geolocation/geolocationSlice";
import { weatherApi } from "../services/WeatherAPI";
import darkModeSlice from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice"; // 인증 슬라이스 추가

export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    geolocation: geolocationSlice.reducer,
    darkMode: darkModeSlice.reducer,
    auth: authReducer, // 인증 상태 저장
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware),
});
