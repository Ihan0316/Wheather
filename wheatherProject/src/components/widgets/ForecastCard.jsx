import { useSelector } from 'react-redux';
import { useGetHourlyForecastQuery } from '../../services/WeatherAPI'; // 엔드포인트를 getHourlyForecast로 변경
import WeatherIcon from '../common/WeatherIcon';

function ForecastCard() {
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data, isSuccess } = useGetHourlyForecastQuery({
    lat,
    lng,
  });

  // 날짜 포맷을 요일로 변환하는 함수
  function convertToDay(dt) {
    let utc_time = new Date(dt * 1000);
    return utc_time.toLocaleDateString('ko-KR', { weekday: 'long' });
  }

  // 하루 단위로 필터링: 하루마다 첫 번째 항목만 추출
  const dailyForecasts = data?.list
    ?.filter((forecast, index, array) => {
      const nextForecast = array[index + 1];
      return (
        !nextForecast ||
        new Date(forecast.dt * 1000).getDate() !==
          new Date(nextForecast.dt * 1000).getDate()
      );
    })
    .slice(1, 6); // 5일치로 제한

  return (
    <>
      {isSuccess && dailyForecasts?.length > 0 ? (
        dailyForecasts.map((forecast, i) => {
          const dayTemp = forecast.main?.temp; // temp를 main 객체 안에서 찾기
          const nightTemp = forecast.main?.temp_min; // 최소 기온을 야간 온도로 설정

          return (
            <div
              key={i}
              className="flex w-full flex-row items-center justify-between overflow-hidden rounded-3xl px-6 shadow-lg dark:bg-neutral-800 md:h-full md:flex-col md:py-4"
            >
              <div className="font-GilroyBold w-auto text-2xl font-semibold">
                {convertToDay(forecast.dt)}
              </div>

              <div className="w-28">
                <WeatherIcon
                  iconType={forecast.weather[0].icon}
                  id={forecast.weather[0].id}
                  size="36"
                />
              </div>
              <div className="w-auto pb-1">
                <div className="flex flex-row gap-1">
                  <div className="font-KardustBold text-3xl">
                    {dayTemp ? Math.round(dayTemp) : 'N/A'}&deg;
                  </div>
                  <div className="font-KardustBold text-3xl text-gray-400">
                    {nightTemp ? Math.round(nightTemp) : 'N/A'}&deg;
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>날씨 데이터를 불러올 수 없습니다.</div>
      )}
    </>
  );
}

export default ForecastCard;
