import React, { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { registerAPI, checkMidAPI, loginAPI } from '../../services/AuthAPI';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

// MBTI 옵션 배열
const MBTI_TYPES = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
];

const RegisterModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 회원가입 폼 데이터 상태
  const [formData, setFormData] = useState({
    mid: '',
    mpw: '',
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    mbti: '',
    gender: '',
  });
  // 에러 및 성공 메시지 상태
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 생년월일 선택을 위한 배열 생성 (년도, 월, 일)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i,
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 입력 필드 변경 시 formData 업데이트 및 간단한 유효성 검사
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'mid') {
      if (value.length < 3 || value.length > 12) {
        setError('아이디는 3~12 글자 사이여야 합니다.');
      } else {
        setError(null);
      }
    }

    if (name === 'mpw') {
      if (value.length < 8) {
        setError('비밀번호는 8자 이상이어야 합니다.');
      } else {
        setError(null);
      }
    }

    if (name === 'mbti') {
      newValue = value.toUpperCase();
      if (!MBTI_TYPES.includes(newValue) && newValue !== '') {
        setError('올바른 MBTI 유형을 선택하세요.');
      } else {
        setError(null);
      }
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // 폼 제출 함수
  const handleSubmit = async () => {
    const { mid, mpw, birthYear, birthMonth, birthDay, mbti, gender } =
      formData;

    // 필수 입력값에 대한 검증
    if (mid.length < 3 || mid.length > 12) {
      setError('아이디는 3~12 글자 사이여야 합니다.');
      return;
    }
    if (mpw.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (!MBTI_TYPES.includes(mbti)) {
      setError('올바른 MBTI 유형을 선택하세요.');
      return;
    }
    if (!birthYear || !birthMonth || !birthDay) {
      setError('생년월일을 모두 선택해주세요.');
      return;
    }
    if (!gender) {
      setError('성별을 선택해주세요.');
      return;
    }

    // 날짜 유효성 검증: 입력받은 연, 월, 일로 생성한 Date 객체가
    // 실제로 동일한 연, 월, 일을 가지는지 확인합니다.
    const birthDateObj = new Date(birthYear, birthMonth - 1, birthDay);
    if (
      birthDateObj.getFullYear() !== Number(birthYear) ||
      birthDateObj.getMonth() !== Number(birthMonth) - 1 ||
      birthDateObj.getDate() !== Number(birthDay)
    ) {
      setError('유효한 생년월일을 입력해주세요.');
      return;
    }

    // 아이디 중복 검사
    try {
      const exists = await checkMidAPI(mid);
      if (exists) {
        setError('이미 사용 중인 아이디입니다.');
        return;
      }
    } catch (err) {
      setError('아이디 확인 중 오류 발생');
      return;
    }

    // 생년월일 문자열 생성 (YYYY-MM-DD)
    const birthdate = `${birthYear}-${String(birthMonth).padStart(
      2,
      '0',
    )}-${String(birthDay).padStart(2, '0')}`;
    const userData = { ...formData, birthdate };

    // 회원가입 및 자동 로그인 처리
    try {
      await registerAPI(userData);
      setSuccess('회원가입을 축하합니다!');
      setError(null);

      // 회원가입 성공 후 자동 로그인 시도
      try {
        const data = await loginAPI({
          mid: formData.mid,
          mpw: formData.mpw,
        });

        if (data && data.accessToken) {
          // 동적 임포트로 jwt-decode 모듈 사용
          const { jwtDecode } = await import('jwt-decode');
          const decoded = jwtDecode(data.accessToken);

          // 인증 데이터 구성
          const authData = {
            user: {
              mid: decoded.mid,
              birthdate: decoded.birthdate,
              mbti: decoded.mbti,
              gender: decoded.gender,
            },
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };

          // Redux 스토어와 localStorage에 인증 데이터 저장
          dispatch(setCredentials(authData));
          localStorage.setItem('auth', JSON.stringify(authData));

          // 모달 닫고 지정된 경로로 이동
          onClose();
          navigate('/weather-app-vite/');
        }
      } catch (loginErr) {
        console.error('자동 로그인 실패:', loginErr);
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white text-black">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">회원가입</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {/* 아이디 입력 */}
            <input
              type="text"
              name="mid"
              value={formData.mid}
              onChange={handleChange}
              placeholder="아이디 (3~12자)"
              className="rounded border p-2 text-sm text-black"
            />
            {/* 비밀번호 입력 */}
            <input
              type="password"
              name="mpw"
              value={formData.mpw}
              onChange={handleChange}
              placeholder="비밀번호 (8자 이상)"
              className="rounded border p-2 text-sm text-black"
            />
            {/* 이름 입력 */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름"
              className="rounded border p-2 text-sm text-black"
            />
            {/* 생년월일 선택 */}
            <div className="flex gap-2">
              <select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                className="rounded border p-2 text-sm text-black"
              >
                <option value="">연도</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                className="rounded border p-2 text-sm text-black"
              >
                <option value="">월</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                className="rounded border p-2 text-sm text-black"
              >
                <option value="">일</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            {/* MBTI 선택 */}
            <select
              name="mbti"
              value={formData.mbti}
              onChange={handleChange}
              className="rounded border p-2 text-sm text-black"
            >
              <option value="">MBTI 선택</option>
              {MBTI_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {/* 성별 선택 */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="rounded border p-2 text-sm text-black"
            >
              <option value="">성별 선택</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
            {/* 에러 및 성공 메시지 */}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {success && <div className="text-sm text-green-500">{success}</div>}
            {/* 등록 버튼 */}
            <button
              onClick={handleSubmit}
              className="whitespace-nowrap rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              type="button"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
