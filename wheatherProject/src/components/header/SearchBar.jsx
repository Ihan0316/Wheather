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

  // 한글 도시명을 영어로 변환하는 맵 (예시)
  const cityTranslationMap = {
    서울: 'Seoul',
    부산: 'Busan',
    인천: 'Incheon',
    대구: 'Daegu',
    뉴욕: 'New York',
    런던: 'London',
    파리: 'Paris',
    도쿄: 'Tokyo',
    베이징: 'Beijing',
    시드니: 'Sydney',
    로스앤젤레스: 'Los Angeles',
    샌프란시스코: 'San Francisco',
    토론토: 'Toronto',
    바르셀로나: 'Barcelona',
    상하이: 'Shanghai',
    모스크바: 'Moscow',
    방콕: 'Bangkok',
    홍콩: 'Hong Kong',
    케이프타운: 'Cape Town',
    아카바: 'Aqaba',
    멕시코시티: 'Mexico City',
    시카고: 'Chicago',
    마드리드: 'Madrid',
    로마: 'Rome',
    암스테르담: 'Amsterdam',
    뒤셀도르프: 'Dusseldorf',
    밀라노: 'Milan',
    나이로비: 'Nairobi',
    케르치: 'Kerch',
    세비야: 'Seville',
    아부다비: 'Abu Dhabi',
    리우데자네이루: 'Rio de Janeiro',
    라고스: 'Lagos',
    상파울루: 'Sao Paulo',
    칸쿤: 'Cancun',
    자카르타: 'Jakarta',
    아테네: 'Athens',
    코펜하겐: 'Copenhagen',
    두바이: 'Dubai',
    카이로: 'Cairo',
    카트만두: 'Kathmandu',
    브라질리아: 'Brasilia',
    쿠알라룸푸르: 'Kuala Lumpur',
    마닐라: 'Manila',
    호치민시티: 'Ho Chi Minh City',
    싱가포르: 'Singapore',
    덴버: 'Denver',
    인디애나폴리스: 'Indianapolis',
    밴쿠버: 'Vancouver',
    리마: 'Lima',
    부에노스아이레스: 'Buenos Aires',
    세인트피터즈버그: 'Saint Petersburg',
    도하: 'Doha',
    두브로브니크: 'Dubrovnik',
    뉴델리: 'New Delhi',
    카라치: 'Karachi',
    카자블랑카: 'Casablanca',
    안탈리아: 'Antalya',
    라호르: 'Lahore',
    테헤란: 'Tehran',
    타이베이: 'Taipei',
    자그레브: 'Zagreb',
    베를린: 'Berlin',
    맨체스터: 'Manchester',
    프랑크푸르트: 'Frankfurt',
    리버풀: 'Liverpool',
    부다페스트: 'Budapest',
    브뤼셀: 'Brussels',
    벤쿠버: 'Vancouver',
    샤르자: 'Sharjah',
    바그다드: 'Baghdad',
    솔트레이크시티: 'Salt Lake City',
    다카: 'Dhaka',
    서울: 'Seoul',
    미니애폴리스: 'Minneapolis',
    발리: 'Bali',
    포틀랜드: 'Portland',
    세부: 'Cebu',
    하노이: 'Hanoi',
    이슬라마바드: 'Islamabad',
    방콕: 'Bangkok',
    델리: 'Delhi',
    라스베이거스: 'Las Vegas',
    안카라: 'Ankara',
    바르샤바: 'Warsaw',
    마르세유: 'Marseille',
    보스턴: 'Boston',
    상트페테르부르크: 'Saint Petersburg',
    하와이: 'Hawaii',
    캔버라: 'Canberra',
    리즈: 'Leeds',
    프리몬트: 'Fremont',
    올랜도: 'Orlando',
    캘거리: 'Calgary',
    포르투갈: 'Lisbon',
    리스본: 'Lisbon',
    미나스제라이스: 'Minas Gerais',
    오클랜드: 'Auckland',
    웰링턴: 'Wellington',
    // 필요에 따라 더 많은 도시 추가
  }; //일단은 도시 수가 몇만개가 되어서 일단은 정적으로 40개 정도만 넣어뒀음

  // "Get Weather" 버튼 클릭 시 실행될 함수
  const handleSearch = async () => {
    if (!city) return;

    // 한국어 도시명을 영어로 변환
    const cityInEnglish = cityTranslationMap[city] || city; // 변환 맵에 없으면 원래 도시명 사용

    try {
      setError('');

      // 1) OpenWeatherMap 'weather?q=도시명' API 호출 (lang=kr 추가)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityInEnglish}&appid=${API_KEY}&units=metric&lang=kr`,
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
          className="whitespace-nowrap rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          검색
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
}

export default SearchBar;
