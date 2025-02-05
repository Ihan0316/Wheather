import { useState } from "react";
import FavoriteWeatherCard from "../components/widgets/FavoriteWeatherCard";
import HourlyForecast from "../components/widgets/HourlyForecast";
import axios from "axios";

function Favorite() {
    const [cities, setCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCityCoordinates = async (cityName) => {
        const apiKey = import.meta.env.VITE_API_KEY_OPENWEATHERMAP;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=kr`
        );
        return response.data;
    };

    const handleAddCity = async (cityName) => {
        const existingCity = cities.find((city) => city.name === cityName);
        if (existingCity) {
            alert("이미 추가된 도시입니다.");
            return;
        }
        const cityData = await fetchCityCoordinates(cityName);
        if (cityData.cod === 200) {
            const newCity = {
                name: cityData.name,
                lat: cityData.coord.lat,
                lng: cityData.coord.lon,
            };
            setCities([...cities, newCity]);
        } else {
            alert("도시를 찾을 수 없습니다.");
        }
    };

    return (
        <main className="container mx-auto">
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="도시를 검색하세요"
                    className="p-2 border border-gray-400 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAddCity(searchTerm);
                            setSearchTerm(""); // 검색창 초기화
                        }
                    }}
                />
                <div className="flex flex-wrap gap-4">
                    {cities.map((city, i) => (
                        <div key={`${city.lat}-${city.lng}`} className="w-full sm:w-1/3 lg:w-1/4 p-4">
                            <FavoriteWeatherCard lat={city.lat} lng={city.lng} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default Favorite;
