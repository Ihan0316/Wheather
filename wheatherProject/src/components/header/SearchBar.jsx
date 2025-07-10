import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveGeoCode } from "../../features/geolocation/geolocationSlice";
import { saveLocation } from "../../features/search/searchSlice";
import { cityTranslationMap } from "../../utils/cityTranslations";

function SearchBar() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [isFading, setIsFading] = useState(false);
  const dispatch = useDispatch();

  // 에러 메시지 3초 뒤 자동 사라짐 + fade-out 효과
  useEffect(() => {
    if (error) {
      setIsFading(false);
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 2500); // 3초 중 마지막 0.5초만 fade

      const clearTimer = setTimeout(() => {
        setError("");
        setCity("");
        setIsFading(false);
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [error]);

  // 에러 발생 시에도 fade-in 효과 적용
  useEffect(() => {
    if (error) {
      setIsFading(true); // 에러 발생 시 먼저 투명하게
      // 0.5초 후 서서히 나타남 (fade-in)
      const fadeInTimer = setTimeout(() => {
        setIsFading(false);
      }, 500);

      // 2.5초 후 다시 투명하게 (fade-out)
      const fadeOutTimer = setTimeout(() => {
        setIsFading(true);
      }, 2500);

      // 3초 후 에러/입력값 초기화
      const clearTimer = setTimeout(() => {
        setError("");
        setCity("");
        setIsFading(false);
      }, 3000);

      return () => {
        clearTimeout(fadeInTimer);
        clearTimeout(fadeOutTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [error]);

  // .env 또는 vite.config에서 API_KEY 가져온다고 가정
  const API_KEY = import.meta.env.VITE_API_KEY_OPENWEATHERMAP;

  // "Get Weather" 버튼 클릭 시 실행될 함수
  const handleSearch = async () => {
    if (!city) return;

    // 한국어 도시명을 영어로 변환
    const cityInEnglish = cityTranslationMap[city] || city; // 변환 맵에 없으면 원래 도시명 사용

    try {
      setError("");

      // 1) OpenWeatherMap 'weather?q=도시명' API 호출 (lang=kr 추가)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityInEnglish}&appid=${API_KEY}&units=metric&lang=kr`
      );

      const data = response.data;
      /**
       * data 구조 예:
       * {
       *   coord: { lon: 126.978, lat: 37.5665 },
       *   sys: { country: "KR", sunrise: ..., sunset: ... },
       *   name: "Seoul", // 한국어로 "서울"로 반환
       *   main: {...},
       *   weather: [...],
       *   ...
       * }
       */

      // 2) 응답에서 lat/lon, 도시명, 국가 등을 추출
      const { lon, lat } = data.coord;
      const cityName = data.name; // 예: "서울" (한글로 변환된 도시명)
      const country = data.sys.country; // 예: "KR"

      // 3) OtherCities 클릭과 같은 방식으로 redux store 업데이트
      dispatch(saveGeoCode({ lat, lng: lon }));
      dispatch(saveLocation(`${cityName}, ${country}`));

      // 4) 스크롤을 맨 위로 (OtherCities에 있던 scrollTo(0, 0)와 동일)
      window.scrollTo(0, 0);

      // 검색창 초기화(원하시는 경우)
      setCity("");
    } catch (err) {
      console.error(err);
      setError("해당 도시 정보를 가져올 수 없습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex w-full flex-col">
          <input
            type="text"
            placeholder={error ? error : "도시를 입력해주세요"}
            className={`w-full rounded-lg border bg-neutral-50 px-4 py-2.5 placeholder-gray-500 outline-none focus:ring-0 dark:bg-neutral-900 dark:placeholder-gray-400 sm:text-sm ${
              error
                ? "border-2 border-red-500 text-red-500 placeholder-red-400 transition-opacity duration-500 dark:text-red-400"
                : "border-2 border-gray-500 text-gray-900 dark:text-gray-100"
            } ${isFading ? "opacity-0" : "opacity-100"}`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            // 엔터 키를 누를 때 handleSearch 호출
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          className="h-full min-h-[44px] whitespace-nowrap rounded bg-gray-500 px-4 py-2 py-0 text-white hover:bg-gray-600"
        >
          검색
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
