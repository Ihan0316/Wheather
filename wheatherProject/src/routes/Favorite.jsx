import { useState } from 'react';
import FavoriteWeatherCard from '../components/widgets/FavoriteWeatherCard';
import HourlyForecast from '../components/widgets/HourlyForecast';
import axios from 'axios';
import { cityTranslationMap } from '../utils/cityTranslations';

function Favorite() {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCityCoordinates = async (cityName) => {
    const apiKey = import.meta.env.VITE_API_KEY_OPENWEATHERMAP;
    // 한글 도시명을 영문으로 변환
    const englishCityName = cityTranslationMap[cityName] || cityName;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${englishCityName}&appid=${apiKey}&units=metric&lang=kr`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddCity = async (cityName) => {
    // 도시명이 cityTranslationMap에 없는 경우 에러 처리
    if (!cityTranslationMap[cityName]) {
      alert('도시 목록에서 선택해주세요.');
      return;
    }

    const existingCity = cities.find((city) => city.name === cityName);
    if (existingCity) {
      alert('이미 추가된 도시입니다.');
      return;
    }

    try {
      const cityData = await fetchCityCoordinates(cityName);
      if (cityData.cod === 200) {
        const newCity = {
          name: cityName, // 한글 도시명 저장
          englishName: cityTranslationMap[cityName] || cityName, // 영문 도시명 저장
          lat: cityData.coord.lat,
          lng: cityData.coord.lon,
        };
        setCities([...cities, newCity]);
      }
    } catch (error) {
      alert('도시를 찾을 수 없습니다.');
    }
  };

  return (
    <main className="container mx-auto">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="도시 이름을 입력하고 목록에서 선택하세요"
            className="w-full rounded-lg bg-neutral-50 px-4 py-2.5 text-gray-900 placeholder-gray-500 outline-none focus:ring-0 dark:bg-neutral-900 dark:text-gray-100 dark:placeholder-gray-400 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (cityTranslationMap[searchTerm]) {
                  handleAddCity(searchTerm);
                  e.preventDefault(); // IME 이벤트 방지
                  e.target.value = ''; // 입력창 직접 초기화
                  setSearchTerm(''); // 상태 초기화
                }
              }
            }}
          />
          {searchTerm && (
            <div className="absolute z-10 mt-1 w-full rounded border border-gray-300 bg-white">
              {Object.keys(cityTranslationMap)
                .filter((city) => city.includes(searchTerm))
                .map((city) => (
                  <div
                    key={city}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => {
                      handleAddCity(city);
                      setSearchTerm('');
                    }}
                  >
                    {city}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          {cities.map((city, i) => (
            <div
              key={`${city.lat}-${city.lng}`}
              className="w-full p-4 sm:w-1/3 lg:w-1/4"
            >
              <FavoriteWeatherCard lat={city.lat} lng={city.lng} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Favorite;
