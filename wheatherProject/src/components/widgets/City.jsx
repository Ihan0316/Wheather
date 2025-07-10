import WeatherIcon from "../common/WeatherIcon";

function City({ city, country, data }) {
  function capitalizeFirstLetter(str) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  }

  const ChangeKorean = {
    "thunderstorm with light rain": "천둥과 부슬비가 내려요! 우산 챙기세요~",
    "thunderstorm with rain": "천둥을 동반한 비가 내려요! 낙뢰를 주의하세요!",
    "thunderstorm with heavy rain": "천둥과 강한 비가 내립니다",
    "light thunderstorm": "천둥을 동반한 폭풍이 붑니다. 외출을 자제해주세요",
    thunderstorm: "천둥폭풍",
    "heavy thunderstorm": "강한 천둥폭풍이 몰아쳐요! 외출을 삼가해주세요",
    "ragged thunderstorm": "불규칙한 천둥폭풍이 붑니다. 안전에 유의하세요!",
    "thunderstorm with light drizzle":
      "천둥을 동반한 가벼운 이슬비가 내려요. 무지개를 기대해봐도 좋을지도!",
    "thunderstorm with drizzle":
      "천둥을 동반한 이슬비가 내려요~ 우산 챙기세요!",
    "thunderstorm with heavy drizzle": "천둥과 강한 이슬비 우산 챙기세요",

    "light intensity drizzle":
      "가벼운 이슬비가 내려요. 그치면 무지개를 기대해봐도 좋아요",
    drizzle: "이슬비",
    "heavy intensity drizzle": "강한 이슬비가 내려요. 우산은 챙겨주세요~",
    "light intensity drizzle rain":
      "가벼운 이슬비 비가 내립니다.그치면 무지개를 기대해봐도 좋아요",
    "drizzle rain": "이슬비 비",
    "heavy intensity drizzle rain":
      "강한 이슬비가 내려요, 젖지않게 조심하세요~",
    "shower rain and drizzle": "비와 이슬비",
    "heavy shower rain and drizzle": "강한 비와 이슬비",
    "shower drizzle": "이슬비 비",

    "light rain": "가벼운 비가 내려요, 우산 챙기세요!",
    "moderate rain": "비가 내립니다. 우산 챙기고 안전에 유의하세요!",
    "heavy intensity rain": "강한 비가 내립니다. 운전조심 하세요!",
    "very heavy rain": "매우 강한 비가 내립니다. 안전에 유의하세요!",
    "extreme rain": "엄청난 장대비가 쏟아집니다. 외출을 자제해주세요",
    "freezing rain": "얼음비",
    "light intensity shower rain": "가벼운 소나기가 내립니다.",
    "shower rain": "소나기가 내립니다",
    "heavy intensity shower rain": "강한 소나기가 쏟아집니다. 조심해주세요!",
    "ragged shower rain": "불규칙한 소나기가 내립니다. 우산을 항상 챙겨주세요!",

    "light snow": "가벼운 눈이 내립니다. 적당히 낭만을 즐겨주세요!",
    snow: "눈이 내려요~",
    "heavy snow":
      "강한 눈이 내립니다. 일기예보를 잘 확인하고 안전에 유의해주세요",
    sleet: "진눈깨비",
    "light shower sleet": "가벼운 진눈깨비가 내려요! 우산을 챙겨주세요",
    "shower sleet": "진눈깨비 소나기가 내립니다. 결빙에 주의해주세요",
    "light rain and snow":
      "가벼운 비와 눈이 내립니다. 도로 결빙을 주의해주세요",
    "rain and snow": "비와 눈이 함께 내립니다. 도로 결빙을 주의해주세요",
    "light shower snow":
      "가벼운 눈과 소나기가 함께 내립니다. 우산을 챙겨주세요",
    "shower snow":
      "눈이 쏟아집니다. 안전에 유의하고, 오늘같은 날은 대중교통을 이용해주세요!",
    "heavy shower snow":
      "눈이 쏟아집니다. 안전에 유의하고, 오늘같은 날은 대중교통을 이용해주세요!",

    mist: "안개가 꼈습니다. 가시거리가 좁으니 안전운전 하세요!",
    smoke: "미세먼지가 심합니다. 마스크 착용해주세요!",
    haze: "안개가 꼈습니다. 가시거리가 좁으니 안전운전 하세요!",
    "sand/dust whirls":
      "황사가 옵니다. 마스크를 끼고, 눈과 손을 자주 씻어주세요",
    fog: "안개가 꼈습니다. 가시거리가 좁으니 안전운전 하세요!",
    sand: "모래",
    dust: "먼지가 많습니다. 마스크를 착용해시고, 야외활동을 자제해주세요",
    "volcanic ash": "화산재",
    squalls: "돌풍",
    tornado: "토네이도",

    "clear sky":
      "하늘이 맑아요! 오늘같은 날은 가족,연인,친구와 함께 밖에 나가보아요!",

    "few clouds": "구름이 조금 있습니다! 맑은 하늘을 봐요!",
    "scattered clouds": "구름이 조금 있습니다! 자신과 닮은 구름을 찾아보세요~",
    "broken clouds": "구름이 많이 있습니다! 뭉게구름을 봐요!",
    "overcast clouds":
      "날이 흐립니다. 비가 내릴것을 대비하여 우산을 챙겨주세요!",
  };

  return (
    <>
      {data && (
        <div className="flex w-full min-w-0 flex-shrink-0 flex-grow-0 justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-md hover:scale-105 hover:transition dark:bg-neutral-800 md:w-[22rem]">
          {/* LEFT */}
          <div className="flex flex-col justify-between">
            <div>
              <div>{country}</div>
              <div className="text-xl font-bold">{city}</div>
            </div>
            <div className="text-md font-medium">
              {ChangeKorean[data.weather[0].description]}
              {/* 문법 객체[키값] === value값으로 출력해준다*/}
            </div>
          </div>
          {/* RIGHT */}
          <div className="flex flex-col items-center justify-between overflow-hidden">
            <div
              className="-mt-2 h-24 w-24"
              style={{
                width: "96px",
                height: "96px",
                minWidth: "96px",
                minHeight: "96px",
              }}
            >
              <WeatherIcon
                iconType={data.weather[0].icon}
                id={data.weather[0].id}
                size={96}
              />
            </div>
            <div className="text-lg font-semibold">
              {Math.round(data.main.temp)}&deg;
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default City;
