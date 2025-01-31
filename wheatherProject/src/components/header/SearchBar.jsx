import { useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
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
    <Combobox value={selectedValue} onChange={handleChange}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={handleInput}
          value={inputValue}
          placeholder="Search for a city"
        />
        {suggestions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {suggestions.map((suggestion, index) => (
              <Combobox.Option
                key={index}
                value={`${suggestion.name},${suggestion.sys.country}`}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                  )
                }
              >
                {suggestion.name}, {suggestion.sys.country}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

export default SearchBar;
