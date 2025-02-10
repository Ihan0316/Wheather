// src/components/header/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Location from './Location';
import SearchBar from './SearchBar';
import ThemeSwitchToggle from './ThemeSwitchToggle';
import { MapPinIcon } from '@heroicons/react/20/solid';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../../features/auth/authSlice';
import FortuneRecommendation from '../header/FortuneRecommendation';
import { SearchCountryModal } from './SearchCountryModal';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import { saveGeoCode } from '../../features/geolocation/geolocationSlice';
import { saveLocation } from '../../features/search/searchSlice';
function Header() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showFortune, setShowFortune] = useState(false);
  const [showSearchCountryModal, setShowSearchCountryModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = window.location.pathname;
  // 일반 기능 – 현재 위치 가져오기
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
  // 버튼 클릭 시 로그인 되어 있지 않으면 경고 띄우고, 로그인 되었다면 해당 모달/페이지로 이동
  const requireAuth = (callback) => {
    if (!auth.user) {
      alert('해당 기능은 로그인 후 이용하실 수 있습니다.');
    } else {
      callback();
    }
  };
  return (
    <>
      <nav className="my-4 flex items-center justify-between pr-6">
        <div className="invisible md:visible">
          <Location />
        </div>
        <div className="mx-auto flex items-center gap-2">
          {auth.user ? (
            <button
              onClick={() => requireAuth(() => setShowSearchCountryModal(true))}
              className="ml-2 rounded bg-gray-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-600"
            >
              도시 선택
            </button>
          ) : (
            <button
              onClick={() =>
                alert('해당 기능은 로그인 후 이용하실 수 있습니다.')
              }
              className="ml-2 cursor-not-allowed rounded bg-gray-500 px-4 py-2 font-semibold text-white opacity-50"
            >
              도시 선택
            </button>
          )}
          <SearchBar />
          <button
            onClick={handleCurrentLocation}
            className="flex w-fit flex-row content-center"
          >
            <MapPinIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          {auth.user ? (
            <button
              onClick={() => requireAuth(() => setShowFortune(true))}
              className="ml-2 rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
            >
              오늘의 운세
            </button>
          ) : (
            <button
              onClick={() =>
                alert('해당 기능은 로그인 후 이용하실 수 있습니다.')
              }
              className="ml-2 cursor-not-allowed rounded bg-blue-500 px-4 py-2 font-semibold text-white opacity-50"
            >
              오늘의 운세
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {auth.user ? (
            <>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                안녕하세요, {auth.user.mid}님!
              </span>
              {localStorage.setItem('userMid', auth.user.mid)}
              <button
                onClick={() => {
                  dispatch(clearCredentials());
                  localStorage.removeItem('userMid');
                  navigate('/weather-app-vite/');
                }}
                className="rounded bg-red-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
              >
                로그인
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="rounded bg-green-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-600"
              >
                회원가입
              </button>
            </>
          )}
          <ThemeSwitchToggle />
        </div>
      </nav>

      <div className="flex gap-2 px-6 py-4 text-lg font-semibold sm:px-0">
        <Link to="/weather-app-vite/">
          <button
            className={`rounded-lg px-4 py-2 ${
              location === '/weather-app-vite/' || location === '/'
                ? 'bg-neutral-200 dark:bg-neutral-800'
                : 'hover:bg-neutral-200 hover:dark:bg-neutral-800'
            }`}
          >
            오늘의날씨
          </button>
        </Link>

        <Link to="forecast">
          <button
            className={`rounded-lg px-4 py-2 ${
              location.includes('forecast')
                ? 'bg-neutral-200 dark:bg-neutral-800'
                : 'hover:bg-neutral-200 hover:dark:bg-neutral-800'
            }`}
          >
            앞으로 5일
          </button>
        </Link>
        <Link
          to="favorite"
          onClick={(e) => {
            if (!auth.user) {
              e.preventDefault();
              alert('해당 기능은 로그인 후 이용하실 수 있습니다.');
            }
          }}
        >
          <button
            className={`rounded-lg px-4 py-2 ${
              location.includes('favorite')
                ? 'bg-neutral-200 dark:bg-neutral-800'
                : 'hover:bg-neutral-200 hover:dark:bg-neutral-800'
            }`}
          >
            즐겨찾기
          </button>
        </Link>
      </div>
      {showFortune && auth.user && (
        <FortuneRecommendation onClose={() => setShowFortune(false)} />
      )}
      {showSearchCountryModal && auth.user && (
        <SearchCountryModal onClose={() => setShowSearchCountryModal(false)} />
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
}
export default Header;
