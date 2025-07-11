// node wheatherProject/src/utils/checkCityApiMismatch.js
// .env 파일 또는 환경변수에 OPENWEATHERMAP_API_KEY를 넣어주세요.
// 실행: node wheatherProject/src/utils/checkCityApiMismatch.js
// (package.json에 "type": "module"이 있으면 import 사용)

import axios from "axios";
import { cityTranslationMap } from "./cityTranslations.js";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY || "여기에_API_KEY_입력";

async function checkAllCityMappings() {
  for (const [kor, eng] of Object.entries(cityTranslationMap)) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          eng
        )}&appid=${API_KEY}&units=metric&lang=kr`
      );
      const apiName = response.data.name;
      if (apiName !== eng) {
        console.warn(
          `[불일치] 한글: ${kor}, cityTranslations: ${eng}, API응답: ${apiName}`
        );
      }
    } catch (err) {
      console.error(
        `[API 오류] ${eng}:`,
        err?.response?.data?.message || err.message
      );
    }
  }
}

checkAllCityMappings();
