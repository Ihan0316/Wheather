import { useGetCurrentWeatherQuery } from '../../services/WeatherAPI';
import { saveGeoCode } from '../../features/geolocation/geolocationSlice';
import { useDispatch } from 'react-redux';
import City from './City';
import { saveLocation } from '../../features/search/searchSlice';

function OtherCities() {
  const dispatch = useDispatch();

  const cities = [
    {
      city: 'Korea',
      country: 'Busan',
      geolocation: { lat: '35.1652', lng: '129.043' },
    },
    {
      city: 'New York',
      country: 'United States',
      geolocation: { lat: '40.7128', lng: '-74.0060' },
    },
    {
      city: 'London',
      country: 'United Kingdom',
      geolocation: { lat: '51.5074', lng: '-0.1278' },
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      geolocation: { lat: '35.6895', lng: '139.6917' },
    },
    {
      city: 'Paris',
      country: 'France',
      geolocation: { lat: '48.8566', lng: '2.3522' },
    },
    {
      city: 'Singapore',
      country: 'Central Singapore',
      geolocation: { lat: '1.28333', lng: '103.85' },
    },
    {
      city: 'Sydney',
      country: 'Australia',
      geolocation: { lat: '-33.8688', lng: '151.2093' },
    },
    {
      city: 'Los Angeles',
      country: 'United States',
      geolocation: { lat: '34.0522', lng: '-118.2437' },
    },
    {
      city: 'Berlin',
      country: 'Germany',
      geolocation: { lat: '52.5200', lng: '13.4050' },
    },
  ];

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
          <div className="mb-4 text-lg font-semibold">Other large cities</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((item, i) => (
              <div
                key={i}
                onClick={() => handleClick(item)}
                className="flex flex-col gap-4 rounded-md p-2 shadow-md" // shadow 추가, border 제거
              >
                <City
                  city={cities[i].city}
                  country={cities[i].country}
                  data={item.data}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default OtherCities;
