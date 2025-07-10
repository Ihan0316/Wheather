import { useSelector } from "react-redux";
import { WiBarometer } from "react-icons/wi";
import { useGetCurrentWeatherQuery } from "../../services/WeatherAPI";

function Pressure({ data }) {
  if (!data) return null;

  function getPressureMessage(pressure) {
    switch (true) {
      case pressure <= 1000:
        return "저기압";
      case pressure <= 1013:
        return "표준기압(보통)";
      case pressure <= 1020:
        return "고기압";
      default:
        return "초고기압";
    }
  }

  return (
    <div className="flex h-40 w-full flex-col items-stretch overflow-hidden rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-800">
      {/* TITLE */}
      <div className="flex flex-row gap-1">
        <WiBarometer className="h-5 w-5" />
        <div className="text-xs font-semibold">기압</div>
      </div>
      <div className="mt-2 h-full">
        <div className="text-2xl font-semibold">{data.main.pressure} hPa</div>
      </div>
      <div className="text-xs">{getPressureMessage(data.main.pressure)}</div>
    </div>
  );
}

export default Pressure;
