import { useState } from 'react';
import { Link } from 'react-router-dom';
import Location from './Location';
import SearchBar from './SearchBar';
import ThemeSwitchToggle from './ThemeSwitchToggle';
import { MapPinIcon } from '@heroicons/react/20/solid';
import { useDispatch } from 'react-redux';
import { saveGeoCode } from '../../features/geolocation/geolocationSlice';
import { saveLocation } from '../../features/search/searchSlice';
import FortuneRecommendation from './FortuneRecommendation'; // FortuneRecommendation 컴포넌트 임포트
import { SearchCountryModal } from './SearchCountryModal'; // SearchCountryModal 컴포넌트 임포트

function Header() {
  const dispatch = useDispatch();
  const [showFortune, setShowFortune] = useState(false);
  const [showSearchCountryModal, setShowSearchCountryModal] = useState(false); // SearchCountryModal 상태 추가

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          fetch(
            `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
              import.meta.env.VITE_API_KEY_OPENWEATHERMAP
            }`,
          )
            .then((response) => response.json())
            .then((data) => {
              const cityAndCountry = `${data.name},${data.sys.country}`;
              dispatch(saveLocation(cityAndCountry));
              dispatch(saveGeoCode({ lat, lng: lon }));
            })
            .catch((error) => {
              console.error('Error fetching weather data:', error);
            });
        },
        (error) => {
          console.error('Error getting location:', error.message);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const toggleFortune = () => {
    setShowFortune(true); // 모달을 열 때마다 true로 설정
  };

  const toggleSearchCountryModal = () => {
    setShowSearchCountryModal(true); // SearchCountryModal 열기
  };

  return (
    <>
      <nav className="my-4 flex items-center justify-between pr-6">
        <div className="invisible md:visible">
          <Location />
        </div>

        <div className="mx-auto flex items-center gap-2">
          {/* SearchCountryModal 버튼 추가 */}
          <button
            onClick={toggleSearchCountryModal}
            className="ml-2 rounded bg-gray-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-600"
          >
            도시 선택
          </button>

          <SearchBar />
          <button
            onClick={handleCurrentLocation}
            className="flex w-fit flex-row content-center"
          >
            <MapPinIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            onClick={toggleFortune}
            className="ml-2 rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            오늘의 운세
          </button>
        </div>

        <ThemeSwitchToggle />
      </nav>
      <div className="flex gap-2 px-6 py-4 text-lg font-semibold sm:px-0">
        <Link to="/weather-app-vite/">
          <button className="rounded-lg px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">
            오늘의날씨
          </button>
        </Link>

        <Link to="forecast">
          <button className="rounded-lg px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">
            앞으로 5일
          </button>
        </Link>

        <Link to="favorite">
          <button className="rounded-lg px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">
            즐겨찾기
          </button>
        </Link>
      </div>

      {/* FortuneRecommendation 모달 */}
      {showFortune && (
        <FortuneRecommendation onClose={() => setShowFortune(false)} />
      )}

      {/* SearchCountryModal 모달 */}
      {showSearchCountryModal && (
        <SearchCountryModal onClose={() => setShowSearchCountryModal(false)} />
      )}
    </>
  );
}

export default Header;
