import React, { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { loginAPI } from '../../services/AuthAPI';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose }) => {
  // 로그인 폼 데이터 및 오류 메시지 관리
  const [credentials, setCredentialsState] = useState({ mid: '', mpw: '' });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 입력 필드 변경 시 상태 업데이트
  const handleChange = (e) => {
    setCredentialsState({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // 엔터 키 입력 시 제출 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 로그인 API 호출, 토큰 검증 및 상태 저장 후 페이지 이동
  const handleSubmit = async () => {
    try {
      const data = await loginAPI(credentials);
      console.log('Received token data:', data);
      console.log('AccessToken string:', data.accessToken);

      // 토큰 형식 확인 (JWT는 점(.) 3개로 구분)
      if (!data.accessToken || data.accessToken.split('.').length !== 3) {
        throw new Error('토큰 형식이 올바르지 않습니다!');
      }

      // 동적 임포트로 jwt-decode 모듈 사용하여 토큰 디코딩
      const { jwtDecode } = await import('jwt-decode');
      const decoded = jwtDecode(data.accessToken);
      console.log('Decoded token:', decoded);

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
    } catch (err) {
      console.error('로그인 처리 중 오류:', err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white text-black">
        <div className="p-6">
          {/* 헤더: 로그인 타이틀 및 닫기 버튼 */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">로그인</h2>
            <button
              onClick={onClose}
              className="text-gray-500 transition-colors hover:text-gray-700"
              type="button"
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </div>
          {/* 로그인 입력폼 */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="mid"
              value={credentials.mid}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="아이디"
              className="rounded border p-2 text-sm text-black"
            />
            <input
              type="password"
              name="mpw"
              value={credentials.mpw}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호"
              className="rounded border p-2 text-sm text-black"
            />
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmit}
                className="whitespace-nowrap rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                type="button"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
