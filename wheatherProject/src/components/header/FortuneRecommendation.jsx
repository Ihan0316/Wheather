// src/components/header/FortuneRecommendation.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetCurrentWeatherQuery } from '../../services/WeatherApi.js';
import { FortuneModal } from './FortuneModal';

/* ────────────────────────────────
 * 1. 띠(12간지) 기본 정보
 * ──────────────────────────────── */
const zodiacTraits = {
  '쥐': {
    personality: '영리하고 빠른 판단력, 사교적, 기회 포착 능력',
    fortune: '금전 감각이 뛰어나지만 변동성이 있음. 인간관계가 넓지만 스트레스 관리 필요',
  },
  '소': {
    personality: '성실하고 인내심 강함, 고집 셈, 신뢰받는 성격',
    fortune: '안정적인 재물운, 느리지만 꾸준히 성장. 건강은 지나친 피로 주의',
  },
  '호랑이': {
    personality: '용맹하고 리더십 강함, 도전적, 감정 기복 있음',
    fortune: '도전적인 기질로 재물운 기복이 있음. 직업적 성공 가능성이 크지만 대인관계 충돌 주의',
  },
  '토끼': {
    personality: '온화하고 배려심 깊음, 예술적 감각, 조용하지만 지혜로움',
    fortune: '재물운은 안정적이지만 소극적일 수 있음. 인간관계가 원만하지만 지나친 배려로 손해 볼 가능성 있음',
  },
  '용': {
    personality: '카리스마 있고 야망이 큼, 자신감 넘침',
    fortune: '재물운이 크지만 기복이 심함. 리더십 강하지만 독선적 태도 조심',
  },
  '뱀': {
    personality: '직관력 뛰어남, 신비로운 분위기, 분석적 사고',
    fortune: '투자 감각이 뛰어나지만 대인관계에서 오해를 받을 수 있음. 건강은 신경계 질환 주의',
  },
  '말': {
    personality: '자유롭고 활동적, 독립심 강함, 충동적',
    fortune: '재물운은 좋지만 관리가 필요함. 건강운은 좋지만 과로 주의',
  },
  '양': {
    personality: '온화하고 감성적, 예술적 기질, 조용한 성향',
    fortune: '재물운은 안정적이지만 기회가 적을 수 있음. 인간관계가 원만하지만 감정 기복 주의',
  },
  '원숭이': {
    personality: '영리하고 유머러스함, 창의적, 재치 있음',
    fortune: '재물운이 좋지만 변동성이 큼. 대인관계에서 신뢰를 얻는 것이 중요',
  },
  '닭': {
    personality: '꼼꼼하고 계획적, 완벽주의 성향',
    fortune: '철저한 계획으로 재물운이 좋음. 다만 너무 예민한 태도는 인간관계에서 마이너스가 될 수 있음',
  },
  '개': {
    personality: '충성심 강하고 정의로움, 신의가 있음',
    fortune: '재물운은 중간 수준이지만 인간관계에서 신뢰를 얻어 성공 가능성이 큼',
  },
  '돼지': {
    personality: '솔직하고 관대함, 낙천적',
    fortune: '돈을 잘 벌지만 쉽게 소비하는 경향. 건강운은 좋지만 지나친 방심 주의',
  },
};

/* ────────────────────────────────
 * 2. MBTI 정보
 * ──────────────────────────────── */
const mbtiInfo = {
  ENTP: {
    trait: '창의적, 말재주 좋음, 즉흥적',
    fortune: '기발한 아이디어로 직업적 성공 가능성이 높음. 연애에서는 자유로운 스타일이지만 장기적 관계 유지가 어려울 수 있음',
  },
  ENTJ: {
    trait: '리더십 강함, 야망이 큼, 목표 지향적',
    fortune: '강한 추진력으로 직업운이 좋지만, 대인관계에서 지나친 독단성을 주의하세요',
  },
  // ... 생략 (나머지 MBTI도 동일한 형식)
  ISFJ: {
    trait: '조용하지만 헌신적, 책임감 강함',
    fortune: '사람들과의 신뢰를 기반으로 일에서 높은 성취감을 얻을 수 있습니다',
  },
};

/* ────────────────────────────────
 * 3. 날씨 한글 변환 & 영향 정보
 * ──────────────────────────────── */
const weatherKor = {
  clear: '맑음',
  clouds: '구름',
  rain: '비',
  snow: '눈',
  thunderstorm: '천둥번개',
  mist: '안개',
  default: '기타',
};

const weatherInfluence = {
  clear: {
    text: '화창한 하늘이 기분까지 밝게 만들어 주는 하루예요.',
    energy: '활기차고 창조적인',
    advice: '새로운 도전을 시작하거나 목표를 세워 보시는 건 어떨까요? 자신감이 샘솟을 거예요!',
  },
  clouds: {
    text: '구름 낀 날씨가 오히려 차분한 집중력을 선사합니다.',
    energy: '침착하고 신중한',
    advice: '복잡한 고민을 정리하고, 내면에 몰입해 보는 시간을 가져보세요.',
  },
  rain: {
    text: '비 내리는 풍경이 세상을 차분하게 적셔 주는 날입니다.',
    energy: '감성적이고 직관적인',
    advice: '가벼운 감정 정리가 필요하다면 차 한 잔과 함께 여유를 즐겨보세요.',
  },
  snow: {
    text: '눈이 내려 세상이 고요해지는 분위기예요.',
    energy: '차분하고 결단력 있는',
    advice: '새로운 계획을 세우거나 집중이 필요한 작업을 하기에 좋은 날입니다.',
  },
  thunderstorm: {
    text: '천둥번개로 다이내믹한 에너지가 감도는 날이네요.',
    energy: '역동적이고 강한 추진력',
    advice: '위험도 있지만 기회도 많습니다. 과감한 도전 전에 꼭 신중한 판단을 해보세요.',
  },
  mist: {
    text: '안개가 가득해 시야가 흐릿하지만, 상상력은 풍부해집니다.',
    energy: '신비롭고 탐구적인',
    advice: '여러 가능성을 열어두고, 직관적인 결정을 내리는 것도 나쁘지 않아요.',
  },
  default: {
    text: '날씨 상태가 조화롭게 유지되고 있습니다.',
    energy: '안정적이고 조화로운',
    advice: '평온한 분위기 속에서 꾸준히 노력하면 좋은 결과가 있을 거예요.',
  },
};

/* ────────────────────────────────
 * 4. 띠(12) + MBTI(16) + 날씨(6)에 따른
 *    "연애운(6가지), 재물운(6가지)" 동적 로직
 * ──────────────────────────────── */

// (1) 연애운 계산 함수
function getLoveFortune(zodiac, mbti, weather) {
  // 1) 기본 띠 별 연애 기운
  const baseLoveLuck = {
    '쥐': 3, '소': 2, '호랑이': 5, '토끼': 4, '용': 5, '뱀': 3,
    '말': 5, '양': 3, '원숭이': 4, '닭': 3, '개': 4, '돼지': 3,
  };

  // 2) MBTI 영향치
  const mbtiInfluence = {
    ENFP: 2, ENTP: 2, ENTJ: 1, ENFJ: 1,
    INFJ: -1, INTJ: -1, INFP: -1, INTP: -1,
    ESFP: 2, ESTP: 2, ESFJ: 1, ESTJ: 1,
    ISTJ: -1, ISFJ: -1, ISTP: -2, ISFP: -1,
  };

  // 3) 날씨 효과
  const weatherEffect = {
    clear: 2, clouds: 0, rain: -1, snow: 1, thunderstorm: -2, mist: -1,
  };

  // 4) 연애점수 계산
  let loveScore = (baseLoveLuck[zodiac] || 3)
    + (mbtiInfluence[mbti] || 0)
    + (weatherEffect[weather] || 0);

  // 5) 랜덤 요소로 +1 확률 추가
  if (Math.random() > 0.8) loveScore += 1;

  // 6) 범위 제한 (0~5)
  loveScore = Math.max(0, Math.min(5, loveScore));

  // 7) 연애운 결과
  const loveFortune = [
    "🖤 이별 & 거리두기 (갈등이 심해질 가능성이 높습니다.)",
    "💙 혼자만의 시간 추천 (연애보다 자기 성장에 집중해야 하는 시기)",
    "💔 불안정한 연애운 (사소한 오해가 다툼으로 번질 수 있음)",
    "💛 평범한 연애운 (큰 변화 없이 무난한 연애 흐름)",
    "💓 관계 발전 기회 (연애 중이라면 한 단계 더 발전 가능)",
    "💖 최고의 연애운 (강력한 연애 기회, 좋은 인연을 만날 가능성)",
  ];

  return loveFortune[loveScore];
}

// (2) 재물운 계산 함수
function getMoneyFortune(zodiac, mbti, weather) {
  // 1) 기본 띠 별 재물 기운
  const baseMoneyLuck = {
    '쥐': 5, '소': 4, '호랑이': 3, '토끼': 3, '용': 5, '뱀': 4,
    '말': 3, '양': 2, '원숭이': 4, '닭': 5, '개': 3, '돼지': 2,
  };

  // 2) MBTI 영향치
  const mbtiInfluence = {
    ENTJ: 2, ESTJ: 2, ENTP: 1, ENFP: 1,
    INTJ: 1, INTP: 1, INFJ: 0, INFP: -1,
    ESFP: -1, ESTP: -1, ESFJ: 0, ISFJ: 1,
    ISTJ: 1, ISTP: -1, ISFP: -2, // ISFJ: 1→중복 제거
  };

  // 3) 날씨 효과
  const weatherEffect = {
    clear: 2, clouds: 0, rain: -1, snow: 1, thunderstorm: -2, mist: -1,
  };

  // 4) 재물점수 계산
  let moneyScore = (baseMoneyLuck[zodiac] || 3)
    + (mbtiInfluence[mbti] || 0)
    + (weatherEffect[weather] || 0);

  // 5) 랜덤 요소로 +1 확률 추가
  if (Math.random() > 0.8) moneyScore += 1;

  // 6) 범위 제한 (0~5)
  moneyScore = Math.max(0, Math.min(5, moneyScore));

  // 7) 재물운 결과
  const moneyFortune = [
    "🚨 큰 손실 위험 (금전적인 위기 가능성이 높습니다.)",
    "⚠️ 위험한 투자 주의 (무리한 투자는 손실로 이어질 수 있음)",
    "💸 지출 증가 주의 (충동 소비 가능성 증가, 신중한 관리 필요)",
    "🏦 저축 & 계획 추천 (수익 증가보다는 장기적인 계획이 중요)",
    "📈 안정적인 재물운 (큰 변화 없이 재정적 흐름 유지)",
    "💰 최고의 재물운 (예상치 못한 수익 상승, 금전적 기회 증가)",
  ];

  return moneyFortune[moneyScore];
}

/* ────────────────────────────────
 * 5. 컴포넌트 시작
 * ──────────────────────────────── */
export default function FortuneRecommendation({ onClose }) {
  // (A) 위치 및 날씨 API
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data: weatherData, isSuccess } = useGetCurrentWeatherQuery({ lat, lng });

  // (B) 사용자 정보
  const currentUser = useSelector((state) => state.auth.user);

  // (C) 상태 관리
  const [fortune, setFortune] = useState('');
  const [error, setError] = useState('');
  const [showFortuneModal, setShowFortuneModal] = useState(false);

  // (D) 띠 계산 함수
  const getZodiacAnimal = (year) => {
    const zodiacAnimals = [
      '원숭이', '닭', '개', '돼지', '쥐',
      '소', '호랑이', '토끼', '용', '뱀',
      '말', '양',
    ];
    const baseYear = 2016; // 원숭이띠 기준
    const index = (year - baseYear) % 12;
    return zodiacAnimals[(index + 12) % 12];
  };

  // (E) 사용자 정보 검증
  const validateUserData = useCallback(() => {
    if (!currentUser) {
      setError('사용자 정보가 존재하지 않습니다.');
      return false;
    }
    if (!currentUser.mbti || !currentUser.birthdate || !currentUser.gender) {
      setError('필요한 사용자 정보(mbti, birthdate, gender)가 부족합니다.');
      return false;
    }
    const birth = new Date(currentUser.birthdate);
    if (isNaN(birth.getTime())) {
      setError('사용자 생년월일이 올바르지 않습니다.');
      return false;
    }
    return true;
  }, [currentUser]);

  // (F) 운세 계산 로직
  const calculateFortune = useCallback(() => {
    // 1) 사용자 데이터 검증, 날씨 로딩 상태 체크
    if (!validateUserData() || !isSuccess || !weatherData) return;

    try {
      // 2) 날짜, 띠, MBTI
      const birthDate = new Date(currentUser.birthdate);
      const birthYear = birthDate.getFullYear();
      const zodiac = getZodiacAnimal(birthYear);          // 예: "호랑이"
      const mbtiKey = (currentUser.mbti || '').toUpperCase(); // 예: "ENFP"

      // 3) 띠/MBTI 정보
      const zodiacData = zodiacTraits[zodiac] || { personality: '', fortune: '' };
      const mbtiData = mbtiInfo[mbtiKey] || { trait: '', fortune: '' };

      // 4) 날씨
      const weatherMainEn = weatherData.weather[0].main.toLowerCase();
      const weatherMainKor = weatherKor[weatherMainEn] || weatherKor.default;
      const weatherObj = weatherInfluence[weatherMainEn] || weatherInfluence.default;
      const temp = Math.round(weatherData.main.temp);

      // 5) 시간대
      const currentHour = new Date().getHours();
      const timeOfDay =
        currentHour >= 5 && currentHour < 12
          ? '아침'
          : currentHour >= 12 && currentHour < 18
            ? '오후'
            : currentHour >= 18 && currentHour < 22
              ? '저녁'
              : '밤';

      // 6) "연애운 & 재물운" 계산
      const loveResult = getLoveFortune(zodiac, mbtiKey, weatherMainEn);
      const moneyResult = getMoneyFortune(zodiac, mbtiKey, weatherMainEn);

      // 7) 최종 운세 메시지 (한 문단 구성)
      const fortuneText = `
[${new Date().toLocaleDateString()} ${timeOfDay}] 오늘의 운세

오늘은 '${zodiac}'띠 특유의 “${zodiacData.personality}” 면모가 돋보일 것 같네요.
MBTI: ${currentUser.mbti}(${mbtiData.trait}) 성향도 더해져, 
당신만의 독특한 에너지가 흘러나올 것으로 예상됩니다.

현재 날씨는 '${weatherMainKor}'(약 ${temp}℃)이며, 
${weatherObj.text} 덕분에 '${weatherObj.energy}' 기운이 함께하고 있답니다.
"${weatherObj.advice}"

💖 연애운: ${loveResult}
💰 재물운: ${moneyResult}

또한, '${mbtiData.fortune}' & '${zodiacData.fortune}' 흐름을 기억하신다면,
오늘 하루를 더욱 슬기롭게 보내실 수 있을 거예요.

멋진 하루 만들어 가시길 응원합니다!
`.trim();

      setFortune(fortuneText);
      setShowFortuneModal(true);
    } catch (err) {
      console.error('운세 계산 중 오류:', err);
      setError('운세 계산 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }, [currentUser, isSuccess, weatherData, validateUserData]);

  // (G) 사용자 정보 변경 시 운세 계산
  useEffect(() => {
    if (currentUser) {
      calculateFortune();
    }
  }, [currentUser, calculateFortune]);

  // (H) 모달 닫기
  const handleFortuneModalClose = () => {
    setShowFortuneModal(false);
    onClose();
  };

  // (I) 렌더링
  return (
    <div className="fixed inset-0 z-50">
      {showFortuneModal && fortune && (
        <FortuneModal fortune={fortune} onClose={handleFortuneModalClose} />
      )}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded text-black">
            <p className="mb-4">{error}</p>
            <button
              onClick={onClose}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
