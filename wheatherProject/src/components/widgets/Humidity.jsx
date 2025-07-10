import { useSelector } from "react-redux";
import { WiHumidity } from "react-icons/wi";
import { useGetCurrentWeatherQuery } from "../../services/WeatherAPI";

function Humidity({ data }) {
  if (!data) return null;

  function getHumidityMessage(humidity) {
    switch (true) {
      case humidity < 30:
        return "밖이 건조해요. 산불 조심!!";
      case humidity < 60:
        return "쾌적한 습도입니다. 대인관계 하기 좋은 날씨!";
      default:
        return "매우 습해 불쾌지수가 높아져요! 서로 신경긁기 금지!";
    }
  }
  return (
    <div className="flex h-40 w-full flex-col items-stretch overflow-hidden rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-800">
      {/* TITLE */}
      <div className="flex flex-row gap-1">
        <WiHumidity className="h-5 w-5" />
        <div className="text-xs font-semibold">습도</div>
      </div>
      <div className="mt-2 h-full">
        <div className="text-2xl font-semibold">{data.main.humidity}%</div>
      </div>
      <div className="text-xs">{getHumidityMessage(data.main.humidity)}</div>
    </div>
  );
}

export default Humidity;
