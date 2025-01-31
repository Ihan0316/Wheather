import { useSelector } from 'react-redux';
import { useGetHourlyForecastQuery } from '../../services/WeatherAPI'; // 엔드포인트를 getHourlyForecast로 변경
import WeatherIcon from '../common/WeatherIcon';

function ForecastCard() {
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data, isSuccess } = useGetHourlyForecastQuery({
    lat,
    lng,
  });

  // 날짜 포맷을 월/일/요일(한 글자) 형식으로 변환하는 함수
  function convertToDay(dt) {
    const utc_time = new Date(dt * 1000);
    const dayOfWeek = utc_time.getDay(); // 요일 숫자 (0: 일요일, 1: 월요일, ...)

    const weekDays = ['일', '월', '화', '수', '목', '금', '토']; // 한 글자 요일 배열

    return `${utc_time.getMonth() + 1}/${utc_time.getDate()}(${
      weekDays[dayOfWeek]
    })`; // 월/일/요일(한 글자)
  }

  // 하루 단위로 필터링: 하루마다 첫 번째 항목만 추출
  const dailyForecasts = data?.list?.filter((forecast, index, array) => {
    const nextForecast = array[index + 1];
    return (
      !nextForecast ||
      new Date(forecast.dt * 1000).getDate() !==
        new Date(nextForecast.dt * 1000).getDate()
    );
  });

  // 하루 단위로 최저 기온, 최고 기온 결정
  const getMinMaxTempForDay = (dayForecasts) => {
    let minTemp = Infinity;
    let maxTemp = -Infinity;

    dayForecasts.forEach((forecast) => {
      const temp = forecast.main?.temp;
      if (temp < minTemp) minTemp = temp;
      if (temp > maxTemp) maxTemp = temp;
    });

    return {
      minTemp,
      maxTemp,
    };
  };

  return (
    <>
      {isSuccess && dailyForecasts?.length > 0 ? (
        dailyForecasts.slice(1, 6).map((forecast, i) => {
          const dayOfDate = new Date(forecast.dt * 1000);
          // 하루 단위로 해당 날짜에 맞는 모든 예보 데이터를 추출
          const dayForecasts = data?.list.filter(
            (forecast) =>
              new Date(forecast.dt * 1000).getDate() === dayOfDate.getDate(),
          );

          // 해당 하루에 대한 최저 기온, 최고 기온을 추출
          const { minTemp, maxTemp } = getMinMaxTempForDay(dayForecasts);

          return (
            <div
              key={i}
              className="flex w-full flex-row items-center justify-between overflow-hidden rounded-3xl px-6 shadow-lg dark:bg-neutral-800 md:h-full md:flex-col md:py-4"
            >
              <div className="font-GilroyBold w-auto text-2xl font-semibold">
                {convertToDay(forecast.dt)} {/* 월/일/요일(한 글자) 표시 */}
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
                  <div className="font-KardustBold text-base">
                    최고:{maxTemp ? Math.round(maxTemp) : 'N/A'}&deg;
                  </div>
                  <div className="font-KardustBold text-base text-gray-400">
                    최저:{minTemp ? Math.round(minTemp) : 'N/A'}&deg;
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
