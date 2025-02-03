import { useSelector } from 'react-redux';
import { WiThermometer } from 'react-icons/wi';
import { useGetCurrentWeatherQuery } from '../../services/WeatherAPI';

function FeelsLike() {
  //   Access to RTX Query cashed data
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data, isSuccess } = useGetCurrentWeatherQuery({
    lat,
    lng,
  });

  function dataProcessor(temp, feels_like) {
    let result;
    switch (true) {
      case temp > feels_like:
        result = '바람이 세게 불어 체감온도가 더 낮아요';
        break;
      case temp === feels_like:
        result = '실제 기온과 체감온도가 비슷합니다!';
        break;
      default:
        result = '정보를 불러 올 수 없습니다';
        break;
    }
    return result;
  }

  return (
    <>
      {isSuccess && (
        <div className="flex h-40 w-full flex-col items-stretch overflow-hidden rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-800">
          {/* TITLE */}
          <div className="flex flex-row gap-1">
            <WiThermometer className="h-5 w-5" />
            <div className="text-xs font-semibold">체감온도</div>
          </div>
          <div className="mt-2 h-full">
            <div className="text-2xl font-semibold">
              {Math.round(data.main.feels_like)}&deg;
            </div>
          </div>
          <div className="text-xs">
            {dataProcessor(
              Math.round(data.main.temp),
              Math.round(data.main.feels_like),
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FeelsLike;
