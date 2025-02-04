import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetCurrentWeatherQuery } from '../../services/WeatherApi.js';
import { FortuneModal } from './FortuneModal'; // 운세 결과 모달
import InputModal from './InputModal'; // 입력 모달

export default function FortuneRecommendation({ onClose }) {
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data: weatherData, isSuccess } = useGetCurrentWeatherQuery({
    lat,
    lng,
  });

  const [userInputs, setUserInputs] = useState({
    mbti: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
  });
  const [fortune, setFortune] = useState('');
  const [error, setError] = useState('');
  const [showInputModal, setShowInputModal] = useState(false); // 초기값 false
  const [showFortuneModal, setShowFortuneModal] = useState(false);

  useEffect(() => {
    setShowInputModal(true); // 컴포넌트가 마운트될 때 입력 모달을 표시
  }, []);

  // 모달 닫기 (X 버튼)
  const handleModalClose = () => {
    setShowInputModal(false);
    onClose(); // 부모 컴포넌트의 닫기 함수 호출
  };

  // 입력 모달 확인 버튼
  const handleInputSubmit = () => {
    if (validateInputs()) {
      setShowInputModal(false);
      calculateFortune();
    }
  };

  // 운세 모달 닫기
  const handleFortuneModalClose = () => {
    setShowFortuneModal(false);
    onClose();
  };

  // MBTI 특성
  const mbtiTraits = {
    ISTJ: '신중하고 책임감 있는',
    ISFJ: '배려심 깊고 헌신적인',
    INFJ: '통찰력 있고 이상적인',
    INTJ: '전략적이고 혁신적인',
    ISTP: '분석적이고 적응력 있는',
    ISFP: '예술적이고 감각적인',
    INFP: '이상주의적이고 창의적인',
    INTP: '논리적이고 창의적인',
    ESTP: '활동적이고 현실적인',
    ESFP: '자유분방하고 즐거운',
    ENFP: '열정적이고 창의적인',
    ENTP: '혁신적이고 독창적인',
    ESTJ: '체계적이고 실용적인',
    ESFJ: '사교적이고 협조적인',
    ENFJ: '카리스마 있고 영감을 주는',
    ENTJ: '결단력 있고 전략적인',
  };

  // 월별 운세 특성
  const monthlyTraits = {
    1: ['새로운 시작', '계획', '도전'],
    2: ['지혜', '통찰', '준비'],
    3: ['성장', '발전', '활력'],
    4: ['창조', '변화', '혁신'],
    5: ['풍요', '번영', '안정'],
    6: ['조화', '균형', '성숙'],
    7: ['열정', '도전', '극복'],
    8: ['결실', '성취', '완성'],
    9: ['지혜', '심사숭고', '완벽'],
    10: ['변화', '적응', '조화'],
    11: ['정리', '마무리', '준비'],
    12: ['휴식', '재충전', '계획'],
  };

  // 성별 특성
  const genderTraits = {
    male: {
      양: ['적극성', '리더십', '도전정신'],
      음: ['신중함', '배려심', '통찰력'],
    },
    female: {
      양: ['창의성', '독립성', '추진력'],
      음: ['직관력', '섬세함', '조화로움'],
    },
  };

  // 입력값 검증
  const validateInputs = useCallback(() => {
    if (
      !userInputs.mbti ||
      !userInputs.birthYear ||
      !userInputs.birthMonth ||
      !userInputs.birthDay ||
      !userInputs.gender
    ) {
      setError('모든 정보를 입력해주세요.');
      return false;
    }

    if (!mbtiTraits[userInputs.mbti]) {
      setError('올바른 MBTI 형식이 아닙니다.');
      return false;
    }

    const year = parseInt(userInputs.birthYear);
    const month = parseInt(userInputs.birthMonth);
    const day = parseInt(userInputs.birthDay);
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) {
      setError('올바른 출생년도를 입력해주세요 (1900-현재).');
      return false;
    }

    if (month < 1 || month > 12) {
      setError('올바른 월을 입력해주세요 (1-12).');
      return false;
    }

    if (day < 1 || day > 31) {
      setError('올바른 일을 입력해주세요 (1-31).');
      return false;
    }

    setError('');
    return true;
  }, [userInputs]);

  // 운세 계산
  const calculateFortune = useCallback(() => {
    if (!validateInputs() || !isSuccess || !weatherData) {
      return;
    }

    try {
      const month = parseInt(userInputs.birthMonth);
      const monthlyAspects = monthlyTraits[month];
      const energy = parseInt(userInputs.birthYear) % 2 === 0 ? '양' : '음';
      const genderAspects = genderTraits[userInputs.gender][energy];

      const temp = Math.round(weatherData.main.temp);
      const weatherMain = weatherData.weather[0].main.toLowerCase();
      const mbtiTrait = mbtiTraits[userInputs.mbti];

      const weatherInfluence = {
        clear: {
          text: '맑은 하늘이 당신의 운세를 밝게 비추어',
          energy: '활동적이고 긍정적인',
        },
        clouds: {
          text: '구름이 당신의 지혜를 더욱 깊게 만들어',
          energy: '신중하고 사려깊은',
        },
        rain: {
          text: '비가 당신의 새로운 시작을 알리며',
          energy: '창의적이고 감성적인',
        },
        snow: {
          text: '눈이 당신의 순수한 열정을 일깨워',
          energy: '평화롭고 차분한',
        },
        thunderstorm: {
          text: '천둥이 당신의 강한 의지를 상징하여',
          energy: '역동적이고 강렬한',
        },
        mist: {
          text: '안개가 당신의 직관을 더욱 예민하게 만들어',
          energy: '신비롭고 직관적인',
        },
        default: {
          text: '오늘의 날씨가 당신의 기운을',
          energy: '균형잡힌',
        },
      };

      const weather = weatherInfluence[weatherMain] || weatherInfluence.default;
      const currentHour = new Date().getHours();
      const timeOfDay =
        currentHour >= 5 && currentHour < 12
          ? '아침'
          : currentHour >= 12 && currentHour < 18
          ? '오후'
          : currentHour >= 18 && currentHour < 22
          ? '저녁'
          : '밤';

      const fortuneText = `
        [${new Date().toLocaleDateString()} ${timeOfDay} 운세]

        ${weather.text} ${mbtiTrait} 당신의 운세를 알려드립니다.

        [기본 성향]
        당신은 ${energy}의 기운을 가진 ${genderAspects[0]}과(와) ${
        genderAspects[1]
      }이(가) 돋보이는 성향입니다.
        현재 ${weather.energy} 에너지가 당신을 감싸고 있습니다.

        [오늘의 운세]
        ${monthlyAspects[0]}과(와) ${
        monthlyAspects[1]
      }이(가) 조화를 이루는 시기입니다.
        특히 ${genderAspects[2]}을(를) 발휘하면 좋은 결과가 있을 것입니다.

        [날씨와 운세]
        현재 기온 ${temp}℃의 ${weatherMain} 날씨는
        ${
          temp < 15
            ? '차분히 내면을 돌아보며 신중하게 행동하기 좋은 날입니다.'
            : '적극적으로 자신의 의견을 표현하고 행동하기 좋은 날입니다.'
        }

        [행운의 시간]
        ${timeOfDay}에는 ${
        timeOfDay === '아침'
          ? '새로운 시작을 계획하는 것이 좋습니다.'
          : timeOfDay === '오후'
          ? '적극적인 활동이 행운을 가져올 것입니다.'
          : timeOfDay === '저녁'
          ? '사람들과의 교류가 좋은 기회를 만들어낼 것입니다.'
          : '충분한 휴식을 취하며 내일을 준비하세요.'
      }
      `;

      setFortune(fortuneText);
      setShowFortuneModal(true);
    } catch (error) {
      console.error('운세 계산 중 오류 발생:', error);
      setError('운세 계산 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }, [
    userInputs,
    isSuccess,
    weatherData,
    mbtiTraits,
    monthlyTraits,
    genderTraits,
    validateInputs,
  ]);

  return (
    <div className="fixed inset-0 z-50">
      {showInputModal && (
        <InputModal
          userInputs={userInputs}
          setUserInputs={setUserInputs}
          onSubmit={handleInputSubmit} // 확인 버튼용
          onClose={handleModalClose} // X 버튼용
        />
      )}

      {showFortuneModal && fortune && (
        <FortuneModal fortune={fortune} onClose={handleFortuneModalClose} />
      )}
    </div>
  );
}
