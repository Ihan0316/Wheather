import WeatherCard from "../components/widgets/WeatherCard";
import HourlyForecast from "../components/widgets/HourlyForecast";
import ForecastCard from "../components/widgets/ForecastCard";
import { useSelector } from "react-redux";
import {
  useGetCurrentWeatherQuery,
  useGetHourlyForecastQuery,
} from "../services/WeatherAPI";

function SevenDay() {
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data: weather, isSuccess: weatherReady } = useGetCurrentWeatherQuery({
    lat,
    lng,
  });
  const { data: forecast, isSuccess: forecastReady } =
    useGetHourlyForecastQuery({ lat, lng });
  const allReady = weatherReady && forecastReady;

  return (
    <div className="fade-in">
      <main className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 sm:p-0 md:w-1/3">
            {weather && <WeatherCard data={weather} />}
            {forecast && <HourlyForecast data={forecast} />}
          </div>
          <div className="mt-4 md:mt-0 md:w-2/3">
            <div className="grid grid-cols-1 justify-items-center gap-4 overflow-hidden px-6 md:max-h-[33rem] md:grid-cols-4 md:hover:overflow-y-auto lg:grid-cols-5 lg:overflow-visible lg:hover:overflow-visible">
              {forecast && <ForecastCard data={forecast} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SevenDay;
