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
      geolocation: { lat: '52.5200', lng: '13.4050' },
      continent: '유럽',
    },
    {
      city: '밴쿠버',
      country: '캐나다',
      geolocation: { lat: '49.2827', lng: '123.1207' },
      continent: '북아메리카',
    },
    {
      city: '카이로',
      country: '이집트',
      geolocation: { lat: '30.0444', lng: '31.2357' },
      continent: '아프리카',
    },
    {
      city: '케이프타운',
      country: '남아프리카 공화국',
      geolocation: { lat: '33.9249', lng: '18.4241' },
      continent: '아프리카',
    },
  ];

  // 대륙별로 도시들을 분류
  const continents = ['아시아', '북아메리카', '유럽', '오세아니아', '아프리카'];

  const citiesByContinent = continents.reduce((acc, continent) => {
    acc[continent] = cities.filter((city) => city.continent === continent);
    return acc;
  }, {});

  const data = cities.map((city) => {
    const { data, isSuccess, isLoading } = useGetCurrentWeatherQuery({
      lat: city.geolocation.lat,
      lng: city.geolocation.lng,
    });
    return { data, isSuccess, isLoading };
  });

  const handleClick = (item) => {
    // Save geolocation to redux store
    dispatch(
      saveGeoCode({
        lat: item.data.coord.lat,
        lng: item.data.coord.lon,
      }),
    );
    // save location to redux store
    dispatch(saveLocation(item.data.name, item.data.sys.country));

    // scroll to top of page
    window.scrollTo(0, 0);
  };

  return (
    <main className="container mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 sm:p-0 md:w-full">
          <div
            className="mb-4 font-semibold"
            style={{
              fontSize: '28px',
              marginTop: '10px',
              marginBottom: '25px',
            }}
          >
            다른도시
          </div>

          {/* 대륙별로 도시들 렌더링 */}
          {continents.map((continent) => (
            <div key={continent} className="mb-8">
              <div className="mb-4 text-xl font-semibold">{continent}</div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {citiesByContinent[continent].map((city, i) => (
                  <div
                    key={i}
                    onClick={() => handleClick(data[i])}
                    className="flex cursor-pointer flex-col gap-4 rounded-lg p-4"
                  >
                    <City
                      city={city.city}
                      country={city.country}
                      data={data[i].data}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default OtherCities;
