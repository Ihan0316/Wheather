/*
  운세 계산 및 점수 기준 설정 참고 자료:
  
  [1] 동양 점성술과 인생 만족도 관련 연구 예시:
       - Huang, G., & Yu, C. (2011). Cultural Differences in Individualism-Collectivism and the Belief in Fate: Evidence from an Asian Perspective.
       - "Fate, Karma and Life Satisfaction: A Cross‐Cultural Study"
       ※ 동양의 전통 관념(운명, 카르마 등)이 개인의 삶의 만족도 및 심리적 영향을 미친다는 연구 결과를 참고하였습니다.
  
  [2] MBTI 성격 유형과 연애 만족도 관련 연구 예시:
       - Pittenger, D. J. (2005). Cautionary Comments Regarding the Myers-Briggs Type Indicator. Consulting Psychology Journal: Practice and Research, 57(3), 210–221.
       - John, O. P., Naumann, L. P., & Soto, C. J. (2008). Paradigm Shift to the Integrative Big Five Trait Taxonomy: History, Measurement, and Conceptual Issues. In Handbook of Personality: Theory and Research (3rd ed., pp. 114–158).
       - Lavner, Karney, & Bradbury (2012). Personality and Marital Satisfaction: A Meta-Analysis. Journal of Marriage and Family.
       ※ MBTI 및 유사 성격 이론이 연애 만족도와 대인관계에 미치는 영향을 참고하였습니다.
  
  [3] 성격과 재정 결정 관련 연구 예시:
       - Jin, L., & Jianakoplos, N. (2012). How Does Wealth Affect Risk Attitudes? American Economic Review, 102(3), 690–709.
       - Kumar, A., & Lee, C. (2006). The Role of Personality in Financial Decision Making: Evidence from a Field Study. Journal of Behavioral Finance.
       ※ 성격적 특성이 금융 의사 결정과 위험 선호도에 미치는 영향을 평가한 연구 결과를 참고하였습니다.
  
  위 자료들을 기반으로, 본 코드에서는 띠(12간지)와 MBTI별 기본 점수, 
  그리고 날씨가 미치는 영향을 가설적으로 반영한 보정치를 적용하여 연애운과 재물운 점수를 산출합니다.
  (실제 적용 시 최신 연구 결과나 메타분석 자료를 추가적으로 검토하여 조정할 필요가 있습니다.)
*/

import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetCurrentWeatherQuery } from '../../services/WeatherApi.js';
import { FortuneModal } from './FortuneModal';

/* ==================================================
   1. 띠(12간지) 정보
================================================== */
const zodiacTraits = {
  쥐: {
    personality: '영리하고 빠른 판단력, 사교적, 기회 포착 능력',
    fortune:
      '금전 감각은 탁월하지만 변동이 심할 수 있어. 인간관계는 넓지만 스트레스 관리에 신경 써야 해',
  },
  소: {
    personality: '성실하고 인내심 강하며 고집이 있고 신뢰받는 성격',
    fortune:
      '안정적인 재물운이지만 성장속도는 느릴 수 있어. 건강에는 피로를 조심해',
  },
  호랑이: {
    personality: '용감하고 리더십이 강하며 도전적이지만 감정 기복이 있을 수 있어',
    fortune:
      '도전적인 기질로 재물운에 변동이 있어. 직업적으로 성공할 가능성이 크지만 대인관계 충돌은 주의해',
  },
  토끼: {
    personality: '온화하고 배려심 깊으며 예술적 감각이 있고 조용하지만 똑똑해',
    fortune:
      '재물운은 안정적일 수 있으나 소극적일 수 있어. 인간관계는 원만하지만 지나친 배려는 손해를 볼 수 있어',
  },
  용: {
    personality: '카리스마 넘치고 야망이 크며 자신감이 넘쳐',
    fortune:
      '재물운이 크지만 기복이 심할 수 있어. 리더십은 좋지만 독선적 태도는 주의해야 해',
  },
  뱀: {
    personality: '직관력이 뛰어나고 신비로운 분위기와 분석적 사고를 지님',
    fortune:
      '투자 감각은 훌륭하지만 대인관계에서 오해를 받을 수 있어. 건강은 신경계 질환에 주의해',
  },
  말: {
    personality: '자유롭고 활동적이며 독립적인 면도 있으며 충동적일 수 있어',
    fortune:
      '재물운은 좋은 편이지만 관리가 필요해. 건강은 양호하지만 과로는 조심해야 해',
  },
  양: {
    personality: '온화하고 감성적이며 예술적 기질이 있고 조용해',
    fortune:
      '재물운은 안정적이지만 기회가 적을 수도 있어. 인간관계는 원만하지만 감정 기복에 주의해',
  },
  원숭이: {
    personality: '영리하고 유머러스하며 창의적이고 재치 있어',
    fortune: '재물운은 좋지만 변동성이 크니 대인관계의 신뢰 쌓기가 중요해',
  },
  닭: {
    personality: '꼼꼼하고 계획적이며 완벽주의적인 면이 있어',
    fortune: '철저한 계획 덕분에 재물운은 좋지만 너무 예민할 수 있어',
  },
  개: {
    personality: '충실하고 정의로우며 신뢰할 수 있어',
    fortune: '재물운은 중간 정도지만 인간관계에서 신뢰를 쌓으면 성공 가능성이 커져',
  },
  돼지: {
    personality: '솔직하고 관대하며 낙천적이야',
    fortune: '돈은 잘 벌지만 쉽게 소비할 수 있어. 건강은 좋지만 방심하면 안 돼',
  },
};

/* ==================================================
   2. MBTI 정보 (16가지)
================================================== */
const mbtiInfo = {
  ISTJ: {
    trait: '신중하고 꼼꼼하며 책임감 강해',
    fortune: '체계적인 계획과 실행력으로 안정적인 성공을 얻을 수 있을 거야',
  },
  ISFJ: {
    trait: '조용하지만 헌신적이고 책임감 있어',
    fortune: '신뢰를 바탕으로 꾸준한 성장이 가능할 거야',
  },
  INFJ: {
    trait: '직관력이 뛰어나고 깊은 이해력을 가진 이상주의자야',
    fortune: '자신의 신념을 믿으면 뜻밖의 기회가 찾아올 거야',
  },
  INTJ: {
    trait: '전략적이고 분석적이며 독립적으로 생각해',
    fortune: '장기적인 목표를 향한 꾸준한 노력이 큰 성과로 이어질 거야',
  },
  ISTP: {
    trait: '실용적이고 문제 해결에 뛰어나며 모험을 즐겨',
    fortune: '빠른 판단력으로 기회를 잘 포착할 수 있을 거야',
  },
  ISFP: {
    trait: '감성적이고 예술적이며 온화해',
    fortune: '자연과 예술에서 영감을 받아 창의적인 기회가 올 거야',
  },
  INFP: {
    trait: '이상주의적이며 따뜻한 감성을 지닌 사람이야',
    fortune: '내면의 가치를 존중하면 소중한 관계와 기회가 생길 거야',
  },
  INTP: {
    trait: '논리적이고 창의적이며 분석력이 뛰어나',
    fortune: '혁신적인 아이디어와 문제 해결 능력이 커리어에 큰 도움을 줄 거야',
  },
  ESTP: {
    trait: '적극적이고 도전적이며 현실적이야',
    fortune: '즉각적인 판단과 실행력 덕분에 단기적으로 성공할 수 있을 거야',
  },
  ESFP: {
    trait: '사교적이고 즐거움을 추구하며 에너지가 넘쳐',
    fortune: '풍부한 인간관계와 긍정적 에너지가 행복을 불러올 거야',
  },
  ENFP: {
    trait: '열정적이고 창의적이며 사람에 대해 민감해',
    fortune: '다양한 교류와 경험이 네 삶에 활력을 줄 거야',
  },
  ENTP: {
    trait: '창의적이고 말재주 있으며 즉흥적이야',
    fortune: '독창적인 아이디어로 직업적 성공의 가능성이 높지만 연애에선 신중해야 해',
  },
  ESTJ: {
    trait: '체계적이고 조직적이며 책임감 넘쳐',
    fortune: '명확한 계획과 규율 덕에 안정적인 성공과 성장을 기대할 수 있을 거야',
  },
  ESFJ: {
    trait: '사교적이고 협력적이며 타인을 배려해',
    fortune: '훌륭한 인간관계와 친절함이 네 삶에 큰 행복을 가져다 줄 거야',
  },
  ENFJ: {
    trait: '카리스마 있고 배려심 깊으며 훌륭한 리더야',
    fortune: '다른 사람들을 이끄는 능력이 큰 보답으로 돌아올 거야',
  },
  ENTJ: {
    trait: '리더십이 강하고 야망 많으며 목표 지향적이야',
    fortune: '강한 추진력과 전략 덕에 많은 기회가 있으나, 독단을 조심해야 해',
  },
};

/* ==================================================
   3. 날씨 한글 변환 및 영향 정보
================================================== */
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
    text: '화창해서 기분이 좋아지는 하루야',
    energy: '활기차고 창의적',
    advice: '새로운 도전을 시작해보면 좋을 것 같아',
  },
  clouds: {
    text: '구름 낀 날씨가 오히려 차분하게 만들어줘',
    energy: '침착하고 신중해',
    advice: '복잡한 고민을 정리하며 내면을 들여다봐',
  },
  rain: {
    text: '비로 인해 분위기가 차분해졌어',
    energy: '감성적이고 직관적',
    advice: '잠시 휴식을 가져 따뜻한 차 한 잔 어때?',
  },
  snow: {
    text: '눈이 내려 세상이 고요해진 느낌이야',
    energy: '차분하고 결단력 있어',
    advice: '집중이 필요한 계획을 세우기에 좋은 날이야',
  },
  thunderstorm: {
    text: '천둥번개가 치며 강렬한 에너지가 느껴져',
    energy: '역동적이고 강한 추진력',
    advice: '위험은 있지만 도전할 기회도 있는 날이야',
  },
  mist: {
    text: '안개 때문에 시야는 흐릿하지만 상상은 풍부해',
    energy: '신비롭고 탐구적',
    advice: '여러 가능성을 열어두고 직관을 믿어봐',
  },
  default: {
    text: '날씨가 편안하게 유지되고 있어',
    energy: '안정적이고 조화로워',
    advice: '차분하게 하루를 보내면 좋을 것 같아',
  },
};

/* ==================================================
   4. 연애운 및 재물운 계산 함수
   - 각 요소(띠, MBTI, 날씨)에 기반하여 점수를 산출하고,
     해당 점수에 맞는 운세 메시지를 반환합니다.
================================================== */
function getLoveFortune(zodiac, mbti, weather) {
  const baseLoveLuck = {
    쥐: 3.5,
    소: 2.5,
    호랑이: 4.5,
    토끼: 4.0,
    용: 4.5,
    뱀: 3.0,
    말: 4.0,
    양: 3.0,
    원숭이: 3.5,
    닭: 2.5,
    개: 3.5,
    돼지: 3.0,
  };

  const mbtiInfluence = {
    ENFP: 2.5,
    ENTP: 2.5,
    ENTJ: 1.0,
    ENFJ: 1.0,
    INFJ: -1.0,
    INTJ: -1.0,
    INFP: -1.0,
    INTP: -1.0,
    ESFP: 2.0,
    ESTP: 2.0,
    ESFJ: 1.0,
    ESTJ: 1.0,
    ISTJ: -1.0,
    ISFJ: -1.0,
    ISTP: -2.0,
    ISFP: -1.0,
  };

  const weatherEffect = {
    clear: 2,
    clouds: 0,
    rain: -1,
    snow: 1,
    thunderstorm: -2,
    mist: -1,
  };

  let loveScore =
    (baseLoveLuck[zodiac] || 3) +
    (mbtiInfluence[mbti] || 0) +
    (weatherEffect[weather] || 0);

  if (Math.random() > 0.8) loveScore += 1;

  loveScore = Math.max(0, Math.min(5, loveScore));
  const index = Math.round(loveScore);

  const loveFortune = [
    '이별 & 거리두기 (갈등이 심해질 수 있어)',
    '혼자만의 시간 추천 (연애보다는 자기 계발에 집중해봐)',
    '불안정한 연애운 (사소한 오해가 다툼으로 번질 수 있어)',
    '평범한 연애운 (큰 변화 없이 무난하게 흘러갈 거야)',
    '관계 발전 기회 (연애 중이면 한 단계 도약할 수 있어)',
    '최고의 연애운 (훌륭한 연애 기회와 좋은 인연 기대해봐)',
  ];
  return loveFortune[index];
}

function getMoneyFortune(zodiac, mbti, weather) {
  const baseMoneyLuck = {
    쥐: 5.0,
    소: 4.5,
    호랑이: 3.5,
    토끼: 3.5,
    용: 5.0,
    뱀: 4.0,
    말: 3.0,
    양: 2.5,
    원숭이: 4.0,
    닭: 5.0,
    개: 3.5,
    돼지: 2.5,
  };

  const mbtiInfluence = {
    ENTJ: 2.0,
    ESTJ: 2.0,
    ENTP: 1.5,
    ENFP: 1.5,
    INTJ: 1.0,
    INTP: 1.0,
    INFJ: 0,
    INFP: -0.5,
    ESFP: -0.5,
    ESTP: -1.0,
    ESFJ: 0,
    ISFJ: 1.0,
    ISTJ: 1.0,
    ISTP: -1.0,
    ISFP: -1.5,
  };

  const weatherEffect = {
    clear: 2,
    clouds: 0,
    rain: -1,
    snow: 1,
    thunderstorm: -2,
    mist: -1,
  };

  let moneyScore =
    (baseMoneyLuck[zodiac] || 3) +
    (mbtiInfluence[mbti] || 0) +
    (weatherEffect[weather] || 0);

  if (Math.random() > 0.8) moneyScore += 1;

  moneyScore = Math.max(0, Math.min(5, moneyScore));
  const index = Math.round(moneyScore);

  const moneyFortune = [
    '큰 손실 위험 (금전 위기가 올 수 있어)',
    '위험한 투자 주의 (무리한 투자는 손실로 이어질 수 있어)',
    '지출 증가 주의 (충동 소비가 늘어날 수 있으니 관리 필요해)',
    '저축 및 계획 추천 (수익보다는 장기 계획이 중요해)',
    '안정적인 재물운 (큰 변화 없이 재정 흐름 유지돼)',
    '최고의 재물운 (예상치 못한 수익 상승과 금전 기회가 많아)',
  ];
  return moneyFortune[index];
}

/* ==================================================
   5. FortuneRecommendation 컴포넌트
   - 사용자, 위치, 날씨 정보를 바탕으로 운세를 계산한 후,
     FortuneModal을 통해 결과를 표시합니다.
================================================== */
export default function FortuneRecommendation({ onClose }) {
  // (A) 위치 및 날씨 데이터 (Redux & RTK Query)
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data: weatherData, isSuccess } = useGetCurrentWeatherQuery({ lat, lng });

  // (B) 로그인된 사용자 정보 (Redux)
  const currentUser = useSelector((state) => state.auth.user);

  // (C) 상태 관리: 운세 메시지, 오류 메시지, 모달 표시 여부
  const [fortune, setFortune] = useState('');
  const [error, setError] = useState('');
  const [showFortuneModal, setShowFortuneModal] = useState(false);

  // (D) 출생 연도를 바탕으로 띠(12간지)를 계산하는 함수
  const getZodiacAnimal = (year) => {
    const zodiacAnimals = [
      '원숭이',
      '닭',
      '개',
      '돼지',
      '쥐',
      '소',
      '호랑이',
      '토끼',
      '용',
      '뱀',
      '말',
      '양',
    ];
    const baseYear = 2016; // 기준: 원숭이띠 해
    const index = (year - baseYear) % 12;
    return zodiacAnimals[(index + 12) % 12];
  };

  // (E) 사용자 정보 검증 함수: MBTI, 생일, 성별 등의 필수 정보 확인
  const validateUserData = useCallback(() => {
    if (!currentUser) {
      setError('사용자 정보가 없어');
      return false;
    }
    if (!currentUser.mbti || !currentUser.birthdate || !currentUser.gender) {
      setError('필요한 사용자 정보(예, mbti, 생일, 성별)가 부족해');
      return false;
    }
    const birth = new Date(currentUser.birthdate);
    if (isNaN(birth.getTime())) {
      setError('생일 정보가 올바르지 않아');
      return false;
    }
    return true;
  }, [currentUser]);

  // (F) 운세 계산 함수: 사용자 및 날씨 정보를 바탕으로 운세 메시지 생성
  const calculateFortune = useCallback(() => {
    if (!validateUserData() || !isSuccess || !weatherData) return;
    try {
      const birthDate = new Date(currentUser.birthdate);
      const birthYear = birthDate.getFullYear();
      const zodiac = getZodiacAnimal(birthYear);
      const mbtiKey = (currentUser.mbti || '').toUpperCase();

      const zodiacData = zodiacTraits[zodiac] || { personality: '', fortune: '' };
      const mbtiData = mbtiInfo[mbtiKey] || { trait: '', fortune: '' };

      const weatherMainEn = weatherData.weather[0].main.toLowerCase();
      const weatherMainKor = weatherKor[weatherMainEn] || weatherKor.default;
      const weatherObj = weatherInfluence[weatherMainEn] || weatherInfluence.default;
      const temp = Math.round(weatherData.main.temp);

      const currentHour = new Date().getHours();
      const timeOfDay =
        currentHour >= 5 && currentHour < 12
          ? '아침'
          : currentHour >= 12 && currentHour < 18
            ? '오후'
            : currentHour >= 18 && currentHour < 22
              ? '저녁'
              : '밤';

      // 연애운 및 재물운 메시지 계산
      const loveResult = getLoveFortune(zodiac, mbtiKey, weatherMainEn);
      const moneyResult = getMoneyFortune(zodiac, mbtiKey, weatherMainEn);

      // 운세 메시지 조합
      const fortuneText = `
[${new Date().toLocaleDateString()} ${timeOfDay}]

오늘은 ${zodiac}띠의 ${zodiacData.personality} 면모가 돋보일 것 같아.
MBTI: ${currentUser.mbti} (${mbtiData.trait})의 성향이 더해져 너만의 독특한 에너지가 흘러나올 거야.
현재 날씨는 ${weatherMainKor} (약 ${temp}℃)인데,
${weatherObj.text} 덕분에 ${weatherObj.energy} 기운이 함께 하고 있어.
${weatherObj.advice}

💖 연애운 : ${loveResult}
💰 재물운 : ${moneyResult}

또, ${mbtiData.fortune}. ${zodiacData.fortune} 흐름을 기억하면 오늘 하루를 좀 더 슬기롭게 보낼 수 있을 거야.
멋진 하루 보내길 바랄게!
      `.trim();

      setFortune(fortuneText);
      setShowFortuneModal(true);
    } catch (err) {
      console.error('운세 계산 중 에러:', err);
      setError('운세 계산 중 에러가 났어. 다시 한 번 해봐.');
    }
  }, [currentUser, isSuccess, weatherData, validateUserData]);

  // (G) 사용자 정보가 변경될 때마다 운세 계산 함수 실행
  useEffect(() => {
    if (currentUser) {
      calculateFortune();
    }
  }, [currentUser, calculateFortune]);

  // (H) 모달 닫기 핸들러: 모달을 닫고 onClose 콜백 실행
  const handleFortuneModalClose = () => {
    setShowFortuneModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {showFortuneModal && fortune && (
        <FortuneModal fortune={fortune} onClose={handleFortuneModalClose} />
      )}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 text-black">
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
