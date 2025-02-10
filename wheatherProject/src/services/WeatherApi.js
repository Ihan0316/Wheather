import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const APIKey = import.meta.env.VITE_API_KEY_OPENWEATHERMAP;

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.openweathermap.org',
  }),
  endpoints: (builder) => ({
    getCurrentWeather: builder.query({
      query: ({ lat, lng }) =>
        `data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${APIKey}`,
    }),
    getForecastDaily: builder.query({
      query: ({ lat, lng }) =>
        `data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${APIKey}`,
    }),
    getCurrentAirPollution: builder.query({
      query: ({ lat, lng }) =>
        `data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${APIKey}`,
    }),
    getHourlyForecast: builder.query({
      query: ({ lat, lng }) =>
        // `data/2.5/forecast/hourly?lat=${lat}&lon=${lng}&cnt=10&units=metric&appid=${APIKey}`,
        `data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${APIKey}`,
    }),
    getWeatherMap: builder.query({
      query: ({ lat, lng }) =>
        `maps/2.0/weather/PA0/2/${lat}/${lng}.png?appid=${APIKey}}`,
    }),
  }),
});

export const {
  useGetCurrentWeatherQuery,
  useGetForecastDailyQuery,
  useGetCurrentAirPollutionQuery,
  useGetHourlyForecastQuery,
} = weatherApi;
