import { useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/20/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveLocation,
  updateSearchValue,
} from '../../features/search/searchSlice';
import { saveGeoCode } from '../../features/geolocation/geolocationSlice';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SearchBar() {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const selectedValue = useSelector((state) => state.search.searchValue);

  const handleInput = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 2) {
      fetch(
        `http://api.openweathermap.org/data/2.5/find?q=${value}&type=like&sort=population&cnt=5&appid=${
          import.meta.env.VITE_API_KEY_OPENWEATHERMAP
        }`,
      )
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data.list);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleChange = (selectedValue) => {
    const parts = selectedValue.split(',');
    const city = parts[0];
    const country = parts[parts.length - 1];
    const cityAndCountry = `${city},${country}`;
    dispatch(updateSearchValue(selectedValue));
    dispatch(saveLocation(cityAndCountry));
    setInputValue('');
  };

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
    setInputValue('');
  };

  useEffect(() => {
    if (selectedValue.length) {
      fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${selectedValue}&appid=${
          import.meta.env.VITE_API_KEY_OPENWEATHERMAP
        }`,
      )
        .then((response) => response.json())
        .then((data) => {
          const { lat, lon } = data.coord;
          dispatch(saveGeoCode({ lat, lng: lon }));
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
    }
  }, [selectedValue, dispatch]);

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative flex items-center">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-5 top-2 h-6 w-6 text-gray-500"
          aria-hidden="true"
        />
        <Combobox
          as="div"
          onChange={handleChange}
          value={selectedValue}
          className="w-full"
          nullable
        >
          <Combobox.Input
            type="text"
            autoComplete="off"
            onChange={handleInput}
            value={inputValue}
            placeholder="Search city..."
            className="w-full rounded-lg bg-neutral-100 py-2.5 pl-14 pr-12 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:text-gray-100 dark:placeholder-gray-400 sm:text-sm"
          />
        </Combobox>
        {/* 위치 버튼을 input 안에 넣고 가운데 정렬 */}
        <button
          onClick={handleCurrentLocation}
          className="flex w-fit flex-row content-center justify-start gap-2 py-2"
        >
          <MapPinIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      {suggestions.length > 0 && (
        <Combobox.Options className="absolute -mb-2 -mt-1.5 max-h-72 w-full max-w-lg origin-top scroll-py-2 rounded-b-lg bg-white text-sm text-gray-800 shadow-md dark:bg-neutral-800 dark:text-gray-100">
          {suggestions.map((suggestion, index) => (
            <Combobox.Option
              key={index}
              value={`${suggestion.name},${suggestion.sys.country}`}
              className={({ active }) =>
                classNames(
                  'cursor-default select-none rounded-lg px-4 py-2',
                  active
                    ? 'bg-blue-100 text-black first:rounded-t-none dark:bg-gray-700 dark:text-white'
                    : '',
                )
              }
            >
              {suggestion.name}, {suggestion.sys.country}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </div>
  );
}

export default SearchBar;
