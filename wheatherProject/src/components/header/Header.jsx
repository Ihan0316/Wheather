import { useState } from 'react';
import { Link } from 'react-router-dom';
import Location from './Location';
import SearchBar from './SearchBar';
import ThemeSwitchToggle from './ThemeSwitchToggle';
import { MapPinIcon } from '@heroicons/react/20/solid';
import { useDispatch } from 'react-redux';
import { saveGeoCode } from '../../features/geolocation/geolocationSlice';
import { saveLocation } from '../../features/search/searchSlice';

function Header() {
  const dispatch = useDispatch();

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

  return (
    <>
      <nav className="my-4 flex items-center justify-between pr-6">
        {/* Location: 맨 왼쪽 */}
        <div className="invisible md:visible">
          <Location />
        </div>

        {/* 가운데 배치 */}
        <div className="mx-auto flex items-center gap-2">
          <SearchBar />
          <button
            onClick={handleCurrentLocation}
            className="flex w-fit flex-row content-center"
          >
            <MapPinIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* ThemeSwitchToggle: 맨 오른쪽 */}
        <ThemeSwitchToggle />
      </nav>
      <div className="flex gap-2 px-6 py-4 text-lg font-semibold sm:px-0">
        <Link to="/weather-app-vite/">
          <button className="rounded-lg px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">
            Today
          </button>
        </Link>

        <Link to="forecast">
          <button className="rounded-lg px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">
            Next 5 days
          </button>
        </Link>
      </div>
    </>
  );
}

export default Header;
