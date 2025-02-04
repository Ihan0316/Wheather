import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HiSun } from "react-icons/hi";

function UVIndex() {
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast`,
          {
            headers: {},
            params: {
              latitude: lat,
              longitude: lng,
              daily: "uv_index_max,uv_index_clear_sky_max",
              timezone: "auto",
            },
          }
        );
        setData(response.data);
        setIndex(response.data.daily.uv_index_max[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [lat, lng]);

  const handleChange = () => {
    return;
  };

  function dataProcessor(data) {
    let result;
    switch (true) {
      case data <= 2:
        result = "좋음";
        break;
      case data > 2 && data <= 5:
        result = "보통";
        break;
      case data > 5 && data <= 7:
        result = "높음";
        break;
      case data > 7 && data <= 10:
        result = "매우높음";
        break;
      case data > 10 && data <= 11:
        result = "최악";
        break;
      default:
        return "존재하지 않는 값입니다.";
    }
    return result;
  }

  function getUVIndexMessage(uvIndex) {
    switch (true) {
      case uvIndex < 3:
        return "야외활동하기 딱 좋은 자외선입니다! 신선한 공기를 느껴보세요";
      case uvIndex < 6:
        return "자외선이 피부미용을 위해 모자나 선크림 꼭 착용해주세요!!";
      case uvIndex < 8:
        return "자외선이 너무 높습니다! 외부활동을 자제해주세요!!!";
      case uvIndex < 11:
        return "가급적 실내에만 머물러 주세요.";
      default:
        return "Take all precautions, including staying indoors during peak hours.";
    }
  }

  return (
    <>
      {data && data.daily.uv_index_max[0] && (
        <div className="flex h-40 w-full flex-col items-stretch overflow-hidden rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-800">
          {/* TITLE */}
          <div className="flex flex-row gap-1">
            <HiSun className="h-4 w-4" />
            <div className="text-xs font-semibold">자외선</div>
          </div>

          {/* MAIN CONTENT */}
          <div className="mt-3 flex h-full flex-col">
            <div className="text-2xl font-semibold">
              {Math.round(data.daily.uv_index_max[0])}
            </div>
            <div className="-mt-2 text-lg font-semibold">
              {dataProcessor(data.daily.uv_index_max[0])}
            </div>

            {/* RANGE SLIDER */}
            <div className="">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                onChange={handleChange}
                value={index}
                className="slider-thumb h-[10px] w-full appearance-none overflow-hidden rounded-md"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(126,212,87,1) 0%, rgba(248,212,73,1) 25%, rgba(235,77,96,1) 75%, rgba(180,96,231,1) 100%)",
                }}
              />
            </div>
          </div>
          <div className="text-xs">
            {getUVIndexMessage(data.daily.uv_index_max[0])}
          </div>
        </div>
      )}
    </>
  );
}
export default UVIndex;
