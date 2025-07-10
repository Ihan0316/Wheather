import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveGeoCode } from "../../features/geolocation/geolocationSlice";
import { saveLocation } from "../../features/search/searchSlice";
import { cityTranslationMap } from "../../utils/cityTranslations";

function SearchBar() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [isFading, setIsFading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // 자동완성 후보 리스트
  const suggestions = Object.entries(cityTranslationMap).filter(
    ([korName, engName]) =>
      korName.includes(city) ||
      engName.toLowerCase().includes(city.toLowerCase())
  );

  // input에서 방향키/엔터 처리
  const handleKeyDown = (e) => {
    if (!city || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const [korName] = suggestions[highlightedIndex];
        handleSearch(korName);
        setCity("");
        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 0);
      } else {
        handleSearch();
      }
    }
  };

  // input 값이 바뀌면 하이라이트 인덱스 초기화
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [city]);

  // input blur 시 드롭다운 닫힘(선택 유지)
  const handleBlur = (e) => {
    // 드롭다운 클릭 시 blur 방지
    setTimeout(() => setHighlightedIndex(-1), 100);
  };

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
  const handleSearch = async (overrideCity) => {
    const searchValue = overrideCity !== undefined ? overrideCity : city;
    if (!searchValue) return;

    // 한국어 도시명을 영어로 변환
    const cityInEnglish = cityTranslationMap[searchValue] || searchValue;

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
      const cityName = data.name; // 예: "Seoul" (영문)
      const country = data.sys.country; // 예: "KR"

      // 영문 → 한글 변환
      const cityNameKor =
        Object.entries(cityTranslationMap).find(
          ([, eng]) => eng === cityName
        )?.[0] || cityName;

      // 3) OtherCities 클릭과 같은 방식으로 redux store 업데이트
      dispatch(saveGeoCode({ lat, lng: lon }));
      dispatch(saveLocation(`${cityNameKor}, ${country}`));

      // 4) 스크롤을 맨 위로 (OtherCities에 있던 scrollTo(0, 0)와 동일)
      window.scrollTo(0, 0);

      // 검색창 초기화(원하시는 경우)
      setCity("");
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    } catch (err) {
      console.error(err);
      setError("해당 도시 정보를 가져올 수 없습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex w-full flex-col">
          <input
            ref={inputRef}
            type="text"
            placeholder={error ? error : "도시를 입력해주세요"}
            className={`w-full rounded-lg border bg-neutral-50 px-4 py-2.5 placeholder-gray-500 outline-none focus:ring-0 dark:bg-neutral-900 dark:placeholder-gray-400 sm:text-sm ${
              error
                ? "border-2 border-red-500 text-red-500 placeholder-red-400 transition-opacity duration-500 dark:text-red-400"
                : "border-2 border-gray-500 text-gray-900 dark:text-gray-100"
            } ${isFading ? "opacity-0" : "opacity-100"}`}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          {/* 자동완성 드롭다운 */}
          {city && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 top-full z-50 mt-1 w-full rounded border border-gray-300 bg-white dark:border-neutral-700 dark:bg-neutral-800"
            >
              {suggestions.map(([korName, engName], idx) => (
                <div
                  key={korName}
                  className={`cursor-pointer p-2 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-neutral-700 ${
                    highlightedIndex === idx
                      ? "bg-gray-200 dark:bg-neutral-700"
                      : ""
                  }`}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseDown={() => {
                    handleSearch(korName);
                    setCity("");
                    setTimeout(() => {
                      if (inputRef.current) inputRef.current.focus();
                    }, 0);
                  }}
                >
                  {korName} ({engName})
                </div>
              ))}
            </div>
          )}
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
