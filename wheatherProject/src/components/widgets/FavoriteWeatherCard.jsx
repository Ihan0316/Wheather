import { useGetCurrentWeatherQuery } from '../../services/WeatherAPI';
import WeatherIcon from '../common/WeatherIcon';
import { TiLocationArrow } from 'react-icons/ti';
import axios from 'axios';

function FavoriteWeatherCard({ lat, lng, isFavorite, id, setWeather }) {
  const { data, isSuccess } = useGetCurrentWeatherQuery({
    lat: lat, // props로 전달된 lat, lng 사용
    lng: lng,
  });

  function convertToDate(timezone, dt) {
    let utc_time = new Date(dt * 1000);
    let local_time = new Date(utc_time.getTime() + timezone * 1000);
    let local_time_Day = local_time.toLocaleString('ko-KR', {
      timeZone: 'UTC',
      weekday: 'long',
    });
    return local_time_Day;
  }

  function convertToHMin(dt) {
    let time = new Date(dt * 1000).toLocaleTimeString('ko-KR', {
      timeZone: 'UTC',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
    });
    return time;
  }

  function getLocalTime(timezone, dt) {
    let utc_time = new Date(dt * 1000);
    let local_time = new Date(utc_time.getTime() + timezone * 1000);
    let local_time_format = local_time.toLocaleTimeString('ko-KR', {
      timeZone: 'UTC',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
    });
    return local_time_format;
  }

  const saveFavorite = async () => {
    const SERVER_URL = import.meta.env.VITE_MARIADB_SET;
    try {
      const token = localStorage.getItem('token');
      const userMid = localStorage.getItem('userMid'); // 로그인한 사용자의 mid 가져오기

      const weatherData = {
        country: data.sys.country,
        city: data.name,
        latitude: lat,
        longitude: lng,
        mid: userMid, // 사용자의 mid 전달
      };

      const response = await axios.post(
        `${SERVER_URL}/api/weather`,
        weatherData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.data === '이미 등록된 즐겨찾기 도시입니다.') {
        alert('이미 등록된 즐겨찾기 도시입니다.');
      } else {
        alert(`${data.name}이(가) 즐겨찾기에 추가되었습니다.`);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요한 서비스입니다.');
      } else {
        console.error('저장 실패:', error);
        alert('즐겨찾기 추가 중 오류가 발생했습니다.');
      }
    }
  };

  // const deleteFavorite = async (id) => {
  //   const SERVER_URL = import.meta.env.VITE_MARIADB_SET;
  //   try {
  //     await axios.delete(`${SERVER_URL}/api/weather/${id}`);
  //     onDelete();  // 부모 컴포넌트에 알리기
  //   } catch (error) {
  //     alert("즐겨찾기 삭제 중 오류가 발생했습니다.");
  //   }
  // };

  const deleteFavorite = async () => {
    const SERVER_URL = import.meta.env.VITE_MARIADB_SET;
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${SERVER_URL}/api/weather/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setWeather((prevWeather) => prevWeather.filter((city) => city.id !== id));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요한 서비스입니다.');
      } else {
        console.error('삭제 실패:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      {isSuccess &&
        [data].map((item, i) => (
          <div
            key={i}
            className="mb-4 h-[21rem] overflow-hidden rounded-3xl bg-white p-6 shadow-lg dark:bg-neutral-800"
          >
            {/* DAY AND TIME */}
            <div className="flex flex-row justify-between">
              <div className="text-xl font-semibold">
                {convertToDate(item.timezone, item.dt)}
              </div>
              <div className="font-KardustBold text-xl">
                {getLocalTime(item.timezone, item.dt)}
              </div>
            </div>
            {/*  */}

            <div className="flex items-center justify-between">
              <div>
                <div className="flex flex-row">
                  <div className="font-semibold">{item.name}</div>
                  <TiLocationArrow />
                </div>

                <div className="font-KardustBold text-8xl">
                  {Math.round(item.main.temp)}&deg;
                </div>
              </div>

              <div className="h-36 w-36 pt-5">
                <WeatherIcon
                  iconType={item.weather[0].icon}
                  id={item.weather[0].id}
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
                    {Math.round(item.main.feels_like)}&deg;
                  </div>
                </div>
                <div className="flex flex-row gap-1">
                  <div>풍속</div>
                  <div className="font-KardustBold">
                    {Math.round(item.wind.speed)} m/s
                  </div>
                </div>

                <div className="flex flex-row gap-1">
                  <div>습도</div>
                  <div className="font-KardustBold">{item.main.humidity}%</div>
                </div>
              </div>
              <div className="ml-1 self-end">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-1">
                    <div>일출</div>
                    <div className="font-KardustBold">
                      {getLocalTime(item.timezone, item.sys.sunrise)}
                    </div>
                  </div>
                  <div className="flex flex-row gap-1">
                    <div>일몰</div>
                    <div className="font-KardustBold">
                      {getLocalTime(item.timezone, item.sys.sunset)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <WeatherIcon iconType={data.weather[0].icon} size={50} />

            <div className="flex justify-end">
              {isFavorite ? (
                <button onClick={deleteFavorite} className="text-red-500">
                  즐겨찾기 삭제
                </button>
              ) : (
                <button onClick={saveFavorite} className="text-green-500">
                  즐겨찾기 추가
                </button>
              )}
            </div>
          </div>
        ))}
    </>
  );
}
export default FavoriteWeatherCard;
