import { useSelector } from 'react-redux';
import { IoWaterSharp } from 'react-icons/io5';
import { useGetCurrentWeatherQuery } from '../../services/WeatherAPI';

function Precipitation() {
  // Access to RTX Query cached data
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data, isSuccess } = useGetCurrentWeatherQuery({
    lat,
    lng,
  });

  // 강수량 메시지 설정 (data가 없을 경우 대비)
  let precipitationMessage = '날씨가 맑습니다.';

  if (data && data.rain) {
    // 비가 오는 경우
    precipitationMessage = '비가 내리고 있습니다. 우산을 챙겨가세요!';
  } else if (data && data.snow) {
    // 눈이 오는 경우
    precipitationMessage = '눈이 내리고 있습니다. 우산을 챙겨가세요!';
  }

  return (
    <>
      {isSuccess && data && (
        <div className="flex h-40 w-full flex-col items-stretch overflow-hidden rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-800">
          {/* TITLE */}
          <div className="flex flex-row gap-1">
            <IoWaterSharp className="h-4 w-4" />
            <div className="text-xs font-semibold">강수량</div>
          </div>
          {/* CONTENT */}
          <div className="mt-3 h-full">
            <div className="text-2xl font-semibold">
              {/* 강수량 값이 있을 경우만 출력 */}
              {data.rain ? data.rain['1h'] : data.snow ? data.snow['1h'] : 0} mm
            </div>
            <div className="font-semibold">지난 3시간</div>
            {/* 강수량 메시지 출력 */}
            <div
              className="text-black dark:text-white"
              style={{ fontSize: '12px', fontWeight: '500', marginTop: '8px' }}
            >
              {precipitationMessage}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Precipitation;
