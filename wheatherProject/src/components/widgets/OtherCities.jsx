import { useGetCurrentWeatherQuery } from '../../services/WeatherAPI';
import { saveGeoCode } from '../../features/geolocation/geolocationSlice';
import { useDispatch } from 'react-redux';
import City from './City';
import { saveLocation } from '../../features/search/searchSlice';

function OtherCities() {
  const dispatch = useDispatch();

  const cities = [
    {
      city: '부산',
      country: '대한민국',
      geolocation: { lat: '35.1652', lng: '129.043' },
      continent: '아시아',
    },
    {
      city: '뉴욕',
      country: '미국',
      geolocation: { lat: '40.7128', lng: '-74.0060' },
      continent: '북아메리카',
    },
    {
      city: '런던',
      country: '영국',
      geolocation: { lat: '51.5074', lng: '-0.1278' },
      continent: '유럽',
    },
    {
      city: '도쿄',
      country: '일본',
      geolocation: { lat: '35.6895', lng: '139.6917' },
      continent: '아시아',
    },
    {
      city: '파리',
      country: '프랑스',
      geolocation: { lat: '48.8566', lng: '2.3522' },
      continent: '유럽',
    },
    {
      city: '싱가포르',
      country: '싱가포르',
      geolocation: { lat: '1.28333', lng: '103.85' },
      continent: '아시아',
    },
    {
      city: '시드니',
      country: '호주',
      geolocation: { lat: '-33.8688', lng: '151.2093' },
      continent: '오세아니아',
    },
    {
      city: '로스앤젤레스',
      country: '미국',
      geolocation: { lat: '34.0522', lng: '-118.2437' },
      continent: '북아메리카',
    },
    {
      city: '베를린',
      country: '독일',
      geolocation: { lat: '52.5244', lng: '13.4105' },
      continent: '유럽',
    },
    {
      city: '밴쿠버',
      country: '캐나다',
      geolocation: { lat: '49.2497', lng: '-123.1193' },
      continent: '북아메리카',
    },

    {
      city: '카이로',
      country: '이집트',
      geolocation: { lat: '30.0626', lng: '31.2497' },
      continent: '아프리카',
    },
    {
      city: '케이프타운',
      country: '남아프리카 공화국',
      geolocation: { lat: '-33.9258', lng: '18.4232' },
      continent: '아프리카',
    },
    {
      city: '멜버른',
      country: '호주',
      geolocation: { lat: '28.0836', lng: '-80.6081' },
      continent: '오세아니아',
    },
    {
      city: '베이징',
      country: '중국',
      geolocation: { lat: '39.9042', lng: '116.4074' },
      continent: '아시아',
    },
    {
      city: '마드리드',
      country: '스페인',
      geolocation: { lat: '40.4165', lng: '-3.7026' },
      continent: '유럽',
    },
    {
      city: '샌프란시스코',
      country: '미국',
      geolocation: { lat: '37.7775', lng: '-122.4163' },
      continent: '북아메리카',
    },
    {
      city: '오클랜드',
      country: '뉴질랜드',
      geolocation: { lat: '-36.8485', lng: '174.7633' },
      continent: '오세아니아',
    },
    {
      city: '웰링턴',
      country: '뉴질랜드',
      geolocation: { lat: '-41.2867', lng: '174.7752' },
      continent: '오세아니아',
    },
    {
      city: '나이로비',
      country: '케냐',
      geolocation: { lat: '-1.2833', lng: '36.8167' },
      continent: '아프리카',
    },
    {
      city: '라고스',
      country: '나이지리아',
      geolocation: { lat: '6.4531', lng: '3.3958' },
      continent: '아프리카',
    },
  ];

  // 대륙별로 도시들을 분류
  const continents = ['아시아', '북아메리카', '유럽', '오세아니아', '아프리카'];

  const citiesByContinent = continents.reduce((acc, continent) => {
    acc[continent] = cities.filter((city) => city.continent === continent);
    return acc;
  }, {});

  const weatherQueries = cities.map((city) => {
    return useGetCurrentWeatherQuery({
      lat: city.geolocation.lat,
      lng: city.geolocation.lng,
    });
  });

  const handleClick = (city) => {
    // 문자열로 된 좌표값을 숫자로 변환
    const lat = parseFloat(city.geolocation.lat);
    const lng = parseFloat(city.geolocation.lng);

    // 숫자로 변환된 좌표값을 저장
    dispatch(
      saveGeoCode({
        lat: lat,
        lng: lng,
      }),
    );

    // city와 country를 개별 인자로 전달
    dispatch(saveLocation(city.city, city.country));

    window.scrollTo(0, 0);
  };

  return (
    <main className="container mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 sm:p-0 md:w-full">
          <h2
            className="mb-4 border-b-2 py-2 text-center font-semibold"
            style={{
              fontSize: '28px',
              marginTop: '100px',
              marginBottom: '25px',
            }}
          ></h2>

          {continents.map((continent) => (
            <div key={continent} className="mb-8">
              <div className="mb-4 text-center text-xl font-semibold">
                {continent}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {citiesByContinent[continent].map((city, index) => {
                  const cityIndex = cities.findIndex(
                    (c) => c.city === city.city,
                  );
                  const { data, isLoading, isError } =
                    weatherQueries[cityIndex];

                  return (
                    <div
                      key={city.city}
                      onClick={() => handleClick(city)}
                      className="flex cursor-pointer flex-col gap-4 rounded-lg p-4 transition-colors"
                    >
                      {isLoading ? (
                        <div className="p-4 text-center">로딩 중...</div>
                      ) : isError ? (
                        <div className="p-4 text-center text-red-500">
                          날씨 정보를 불러올 수 없습니다
                        </div>
                      ) : (
                        <City
                          city={city.city}
                          country={city.country}
                          data={data}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default OtherCities;
