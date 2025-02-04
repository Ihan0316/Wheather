import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { saveGeoCode } from '../../features/geolocation/geolocationSlice';
import { saveLocation } from '../../features/search/searchSlice';

function SearchBar() {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  // .env 또는 vite.config에서 API_KEY 가져온다고 가정
  const API_KEY = import.meta.env.VITE_API_KEY_OPENWEATHERMAP;

  // "Get Weather" 버튼 클릭 시 실행될 함수
  const handleSearch = async () => {
    if (!city) return;
    try {
      setError('');

      // 1) OpenWeatherMap 'weather?q=도시명' API 호출
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );

      const data = response.data;
      // data 구조 예:
      // {
      //   coord: { lon: 126.978, lat: 37.5665 },
      //   sys: { country: "KR", sunrise: ..., sunset: ... },
      //   name: "Seoul",
      //   main: {...},
      //   weather: [...],
      //   ...
      // }

      // 2) 응답에서 lat/lon, 도시명, 국가 등을 추출
      const { lon, lat } = data.coord;
      const cityName = data.name; // 예: "Seoul"
      const country = data.sys.country; // 예: "KR"

      // 3) OtherCities 클릭과 같은 방식으로 redux store 업데이트
      dispatch(saveGeoCode({ lat, lng: lon }));
      dispatch(saveLocation(`${cityName}, ${country}`));

      // 4) 스크롤을 맨 위로
      window.scrollTo(0, 0);

      // 검색창 초기화
      setCity('');
    } catch (err) {
      console.error(err);
      setError('해당 도시 정보를 가져올 수 없습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="도시를 입력해주세요"
          className="w-full rounded-lg bg-neutral-50 px-4 py-2.5
                     text-gray-900 placeholder-gray-500 outline-none
                     focus:ring-0 dark:bg-neutral-900 dark:text-gray-100
                     dark:placeholder-gray-400 sm:text-sm"
          value={city}
          onChange={(e) => setCity(e.target.value)}

          // 엔터 키를 누를 때 handleSearch 호출
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
}

export default SearchBar;
