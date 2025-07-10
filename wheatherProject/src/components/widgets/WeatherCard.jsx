import { useSelector } from "react-redux";
import { useGetCurrentWeatherQuery } from "../../services/WeatherAPI";
import WeatherIcon from "../common/WeatherIcon";
import { TiLocationArrow } from "react-icons/ti";

function WeatherCard({ data }) {
  if (!data) return null;
  const { lat, lng } = data.coord;

  function convertToDate(timezone, dt) {
    let utc_time = new Date(dt * 1000);
    let local_time = new Date(utc_time.getTime() + timezone * 1000);
    let local_time_Day = local_time.toLocaleString("ko-KR", {
      timeZone: "UTC",
      weekday: "long",
    });
    return local_time_Day;
  }

  function convertToHMin(dt) {
    let time = new Date(dt * 1000).toLocaleTimeString("ko-KR", {
      timeZone: "UTC",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    return time;
  }

  function getLocalTime(timezone, dt) {
    let utc_time = new Date(dt * 1000);
    let local_time = new Date(utc_time.getTime() + timezone * 1000);
    let local_time_format = local_time.toLocaleTimeString("ko-KR", {
      timeZone: "UTC",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    return local_time_format;
  }

  return (
    <div
      key={`${lat},${lng}`}
      className="mb-4 h-[21rem] overflow-hidden rounded-3xl bg-white p-6 shadow-lg dark:bg-neutral-800"
    >
      {/* DAY AND TIME */}
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">
          {convertToDate(data.timezone, data.dt)}
        </div>
        <div className="font-KardustBold text-xl">
          {getLocalTime(data.timezone, data.dt)}
        </div>
      </div>
      {/*  */}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex flex-row">
            <div className="font-semibold">{data.name}</div>
            <TiLocationArrow />
          </div>
          <div className="font-KardustBold text-8xl">
            {Math.round(data.main.temp)}&deg;
          </div>
        </div>

        <div className="h-36 w-36 pt-5">
          <WeatherIcon
            iconType={data.weather[0].icon}
            id={data.weather[0].id}
            size={36}
          />
        </div>
      </div>
      {/* PARAMETERS */}
      <div className="mt-8 flex flex-row justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1">
            <div>체감온도</div>
            <div className="font-KardustBold">
              {Math.round(data.main.feels_like)}&deg;
            </div>
          </div>
          <div className="flex flex-row gap-1">
            <div>풍속</div>
            <div className="font-KardustBold">
              {Math.round(data.wind.speed)} m/s
            </div>
          </div>
          <div className="flex flex-row gap-1">
            <div>습도</div>
            <div className="font-KardustBold">{data.main.humidity}%</div>
          </div>
        </div>
        <div className="ml-1 self-end">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1">
              <div>일출</div>
              <div className="font-KardustBold">
                {getLocalTime(data.timezone, data.sys.sunrise)}
              </div>
            </div>
            <div className="flex flex-row gap-1">
              <div>일몰</div>
              <div className="font-KardustBold">
                {getLocalTime(data.timezone, data.sys.sunset)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default WeatherCard;
