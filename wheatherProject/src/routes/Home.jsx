import WeatherCard from "../components/widgets/WeatherCard";
import HourlyForecast from "../components/widgets/HourlyForecast";
import AirPollution from "../components/widgets/AirPollution";
import SunsetSunrise from "../components/widgets/SunsetSunrise";
import Wind from "../components/widgets/Wind";
import UVIndex from "../components/widgets/UVIndex";
import Precipitation from "../components/widgets/Precipitation";
import FeelsLike from "../components/widgets/FeelsLike";
import Humidity from "../components/widgets/Humidity";
import Visibility from "../components/widgets/Visibility";
import Pressure from "../components/widgets/Pressure";
import ChanceOfRain from "../components/widgets/ChanceOfRain";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  useGetCurrentWeatherQuery,
  useGetCurrentAirPollutionQuery,
  useGetHourlyForecastQuery,
} from "../services/WeatherAPI";
import axios from "axios";
import OtherCities from "../components/widgets/OtherCities";

function Home() {
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);

  // RTK Query
  const { data: weather, isSuccess: weatherReady } = useGetCurrentWeatherQuery({
    lat,
    lng,
  });
  const { data: air, isSuccess: airReady } = useGetCurrentAirPollutionQuery({
    lat,
    lng,
  });
  const { data: forecast, isSuccess: forecastReady } =
    useGetHourlyForecastQuery({ lat, lng });

  // UVIndex는 axios로 직접 불러오는 구조라면 아래처럼 처리
  const [uv, setUv] = useState(null);
  const [uvReady, setUvReady] = useState(false);
  useEffect(() => {
    if (lat && lng) {
      axios
        .get("https://api.open-meteo.com/v1/forecast", {
          params: {
            latitude: lat,
            longitude: lng,
            daily: "uv_index_max,uv_index_clear_sky_max",
            timezone: "auto",
          },
        })
        .then((res) => {
          setUv(res.data);
          setUvReady(true);
        });
    }
  }, [lat, lng]);

  const allReady = weatherReady && airReady && forecastReady && uvReady;

  return (
    <div className="w-full max-w-none">
      {allReady && (
        <div className="fade-in w-full max-w-none">
          <main className="w-full max-w-none px-0">
            <div className="grid w-full max-w-none grid-cols-1 gap-4 px-0 md:grid-cols-3">
              {/* 오늘의 날씨 및 5일 예보 */}
              <div>
                <WeatherCard data={weather} />
                <HourlyForecast data={forecast} />
              </div>
              {/* 기타 위젯들 */}
              <div className="col-span-2">
                <div className="grid w-full max-w-none grid-cols-2 justify-items-center gap-4 px-0 md:grid-cols-3 lg:grid-cols-4">
                  <div className="col-span-2 w-full">
                    <AirPollution data={air} />
                  </div>
                  <SunsetSunrise data={weather} />
                  <Wind data={weather} />
                  <UVIndex data={uv} />
                  <Precipitation data={weather} />
                  <FeelsLike data={weather} />
                  <Humidity data={weather} />
                  <Visibility data={weather} />
                  <Pressure data={weather} />
                  <div className="col-span-2 w-full">
                    <ChanceOfRain data={forecast} />
                  </div>
                </div>
              </div>
              {/* 다른 도시의 날씨: 한 줄 전체 차지 */}
              <div className="col-span-full">
                <OtherCities />
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default Home;
