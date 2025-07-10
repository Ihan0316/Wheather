import { useSelector } from "react-redux";
import { MdVisibility } from "react-icons/md";
import { useGetCurrentWeatherQuery } from "../../services/WeatherAPI";

function Visibility({ data }) {
  if (!data) return null;

  function distanceFormating(distance) {
    if (distance >= 1000) {
      const distanceValue = distance / 1000;
      return distanceValue + " km";
    } else {
      return distance + " m";
    }
  }

  function dataProcessor(visibilityValue) {
    let visibility = visibilityValue / 1000;
    let result;
    switch (true) {
      case visibility === 10:
        result = "구름 한 점 없는 맑은 하늘입니다!!";
        break;
      case visibility < 10:
        result = "가벼운 안개가 시야를 방해할 수 있습니다!";
        break;
      default:
        result = "데이터를 불러올 수 없습니다.";
        break;
    }
    return result;
  }

  return (
    <>
      {/* isSuccess && ( */}
      <div className="flex h-40 w-full flex-col items-stretch overflow-hidden rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-800">
        {/* TITLE */}
        <div className="flex flex-row gap-1">
          <MdVisibility className="h-4 w-4" />
          <div className="text-xs font-semibold">가시거리</div>
        </div>
        <div className="mt-2 h-full">
          <div className="text-2xl font-semibold">
            {distanceFormating(data.visibility)}
          </div>
        </div>
        <div className="text-xs">{dataProcessor(data.visibility)}</div>
      </div>
      {/* ) */}
    </>
  );
}

export default Visibility;
