import React, { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';

// 🌍 한글 도시명을 영어로 변환하는 매핑
const cityNameMap = {
  서울: 'Seoul',
  부산: 'Busan',
  도쿄: 'Tokyo',
  런던: 'London',
  파리: 'Paris',
  베를린: 'Berlin',
  로스앤젤레스: 'Los Angeles',
  뉴욕: 'New York',
  밴쿠버: 'Vancouver',
  시드니: 'Sydney',
  멜버른: 'Melbourne',
  카이로: 'Cairo',
  케이프타운: 'Cape Town',
  나이로비:'Nairobi',
  웰링턴:'Wellington',
  오클랜드:'Auckland',
  마드리드:'Madrid',
  샌프란시스코:'San Francisco',
  라고스:'Lagos',
  베이징:'Beijing',

};

const reverseCityNameMap = Object.fromEntries(
  Object.entries(cityNameMap).map(([key, value]) => [value, key]),
);

// 대륙, 나라, 도시 데이터
const locationData = {
  아시아: {
    한국: ['서울', '부산'],
    일본: ['도쿄'],
    중국: ['베이징'],
  },
  유럽: {
    영국: ['런던'],
    프랑스: ['파리'],
    독일: ['베를린'],
    스페인 : ['마드리드'],
  },
  북아메리카: {
    미국: ['로스앤젤레스', '뉴욕','샌프란시스코'],
    캐나다: ['밴쿠버'],
  },
  오세아니아: {
    호주: ['시드니', '멜버른'],
    뉴질랜드: ['오클랜드','웰링턴'],
  },
  아프리카: {
    이집트: ['카이로'],
    남아프리카공화국: ['케이프타운'],
    케냐:['나이로비'],
    나이지리아:['라고스']
  },
};

export const SearchCountryModal = ({ onClose }) => {
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // 대륙 선택 핸들러
  const handleContinentSelect = (continent) => {
    setSelectedContinent(continent);
    setSelectedCountry(null);
    setSelectedCity(null);
    setWeatherData(null); // 다른 대륙을 선택하면 날씨 정보 초기화
  };

  // 나라 선택 핸들러
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedCity(null);
    setWeatherData(null); // 다른 나라를 선택하면 날씨 정보 초기화
  };

  // 도시 선택 핸들러
  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setWeatherData(null); // 도시를 선택하면 날씨 정보 초기화

    // 한글 도시명을 영어로 변환 (없으면 원래 한글 그대로 사용)
    const cityName = cityNameMap[city] || city;
    const encodedCity = encodeURIComponent(cityName);
    const apiKey =  import.meta.env.VITE_API_KEY_OPENWEATHERMAP;
    // 자기 api 키 찾아서 무조건 넣어야함!!!! 아니면 console 에 오류 뜸 !
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=kr`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('API Response:', data); // 🔍 디버깅용

      if (data.cod !== 200) {
        throw new Error(`API 오류: ${data.message}`);
      }

      setWeatherData(data);
    } catch (error) {
      console.error('날씨 정보를 가져오는 중 오류 발생:', error);
      setWeatherData(null);
    }
  };

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="animate-slideUp max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-neutral-800">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">도시 선택 및 날씨 정보</h2>
            <button
              onClick={onClose}
              className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </div>

          {/* 대륙 선택 */}
          <div className="mb-4">
            <h3 className="mb-2 font-medium">대륙 선택</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(locationData).map((continent) => (
                <button
                  key={continent}
                  onClick={() => handleContinentSelect(continent)}
                  className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  {continent}
                </button>
              ))}
            </div>
          </div>

          {/* 나라 선택 */}
          {selectedContinent && (
            <div className="mb-4">
              <h3 className="mb-2 font-medium">나라 선택</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(locationData[selectedContinent]).map((country) => (
                  <button
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 도시 선택 */}
          {selectedCountry && (
            <div className="mb-4">
              <h3 className="mb-2 font-medium">도시 선택</h3>
              <div className="flex flex-wrap gap-2">
                {locationData[selectedContinent][selectedCountry].map(
                  (city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="rounded bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
                    >
                      {city}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* 날씨 정보 표시 */}
          {weatherData && (
            <div className="mt-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-6 dark:border-neutral-600 dark:bg-neutral-700">
              <h3 className="mb-4 text-center text-xl font-semibold">
                날씨 정보
              </h3>
              <div className="space-y-2 text-sm leading-6">
                <div className="flex justify-between">
                  <span className="font-medium">🗽 도시:</span>
                  <span>
                    {reverseCityNameMap[weatherData.name] || weatherData.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🌡️ 온도:</span>
                  <span>{Math.round(weatherData.main.temp)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🌈 날씨:</span>
                  <span>{weatherData.weather[0].description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">🌫️ 습도:</span>
                  <span>{weatherData.main.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">💨 풍속:</span>
                  <span>{weatherData.wind.speed} m/s</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
