import { useSelector } from "react-redux";
import { GiAbstract053 } from "react-icons/gi";
import { useGetCurrentAirPollutionQuery } from "../../services/WeatherAPI";

function AirPollution({ data }) {
  if (!data) return null;

  function describeAirQuality(aqi, showPrevention = false) {
    const airQualityLevels = {
      1: {
        description: "매우좋음",
        prevention: "쾌적한 하늘을 마주하세요!",
      },
      2: {
        description: "보통",
        prevention: "호흡기가 민감하다면 장시간 외출을 삼가해주세요",
      },
      3: {
        description: "약간나쁨",
        prevention:
          "장시간 활동이나 강한 운동을 줄이세요. 휴식을 더 자주 취하고, 덜 강도 높은 활동을 하세요.",
      },
      4: {
        description: "나쁨",
        prevention: "외출을 가급적 하지않고 실내에 머물러 주세요.",
      },
      5: {
        description: "매우나쁨",
        prevention: "모든 야외활동을 중단하고, 가능한 집에서 머물러 주세요!",
      },
    };

    if (airQualityLevels[aqi]) {
      if (showPrevention) {
        return airQualityLevels[aqi].prevention;
      } else {
        return airQualityLevels[aqi].description;
      }
    } else {
      return "Invalid AQI value";
    }
  }

  return (
    <div className="flex h-40 flex-col overflow-hidden rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-800">
      {/* TITLE */}
      <div className="flex flex-row gap-1">
        <GiAbstract053 className="h-4 w-4" />
        <div className="text-xs font-semibold">대기오염</div>
      </div>
      {/* MAIN CONTENT */}
      <div className="mt-2 flex h-full flex-col">
        <div className="text-2xl font-semibold">
          {describeAirQuality(data.list[0].main.aqi, false)}
        </div>

        {/* RANGE SLIDER */}
        <div className="">
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={data.list[0].main.aqi}
            onChange={() => {}}
            className="slider-thumb h-[10px] w-full appearance-none overflow-hidden rounded-md"
            style={{
              background:
                "linear-gradient(90deg, rgba(58,110,180,1) 0%, rgba(126,212,87,1) 20%, rgba(248,212,73,1) 40%, rgba(235,77,96,1) 60%, rgba(180,96,231,1) 80%, rgba(178,34,34,1) 100%)",
            }}
          />
        </div>
      </div>
      <div className="text-xs">
        {describeAirQuality(data.list[0].main.aqi, true)}
      </div>
    </div>
  );
}

export default AirPollution;
