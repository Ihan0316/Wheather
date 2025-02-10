// src/services/AuthAPI.js

// API 기본 URL을 환경변수(VITE_API_BASE_URL)에서 읽어오며,
// 환경변수가 없으면 'http://localhost:8080'을 기본값으로 사용합니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * loginAPI 함수: 사용자 로그인 요청을 처리합니다.
 * @param {Object} param0 - 로그인 정보 객체
 * @param {string} param0.mid - 사용자 아이디
 * @param {string} param0.mpw - 사용자 비밀번호
 * @returns {Object} - 성공 시 { accessToken, refreshToken } 객체 반환
 * @throws {Error} - 로그인 실패 시 에러 메시지 포함 Error 객체 throw
 */
export async function loginAPI({ mid, mpw }) {
  // POST 방식으로 /generateToken 엔드포인트에 로그인 요청을 보냅니다.
  const response = await fetch(`${API_BASE_URL}/generateToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 요청 본문을 JSON으로 전달
    },
    body: JSON.stringify({ mid, mpw }),
  });

  // 응답이 정상적이지 않을 경우 에러 처리
  if (!response.ok) {
    let errorMsg = '로그인 실패';
    try {
      // 응답 본문을 JSON으로 파싱 시도
      const errorData = await response.json();
      errorMsg = errorData.msg || errorMsg;
    } catch (e) {
      // JSON 파싱이 실패하면 response.statusText를 fallback 메시지로 사용
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  // 성공 시 JSON 응답 데이터를 반환 ({ accessToken, refreshToken } 객체)
  return await response.json();
}

/**
 * registerAPI 함수: 사용자 회원가입 요청을 처리합니다.
 * @param {Object} userData - 회원가입에 필요한 사용자 정보 객체 (mid, mpw, name, birthdate, mbti, gender)
 * @returns {string} - 성공 시 "회원가입 성공" 등의 메시지 반환
 * @throws {Error} - 회원가입 실패 시 에러 메시지 포함 Error 객체 throw
 */
export async function registerAPI(userData) {
  // POST 방식으로 /member/register 엔드포인트에 회원가입 요청을 보냅니다.
  const response = await fetch(`${API_BASE_URL}/member/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 요청 데이터를 JSON 형식으로 전송
    },
    body: JSON.stringify(userData),
  });

  // 응답 상태가 실패라면 에러 처리
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '회원가입 실패');
  }

  // 성공 시 텍스트 형식의 응답 데이터를 반환합니다.
  return await response.text();
}

/**
 * checkMidAPI 함수: 아이디 중복 여부를 확인합니다.
 * @param {string} mid - 확인할 아이디
 * @returns {boolean} - 중복이면 true, 사용 가능이면 false 반환
 * @throws {Error} - 아이디 검사 중 오류 발생 시 에러 throw
 */
export async function checkMidAPI(mid) {
  // GET 방식으로 /member/check-mid 엔드포인트에 아이디 검사 요청을 보냅니다.
  const response = await fetch(
    `${API_BASE_URL}/member/check-mid?mid=${encodeURIComponent(mid)}`,
    { method: 'GET' }
  );

  // 응답 상태가 실패하면 에러를 throw합니다.
  if (!response.ok) {
    throw new Error('아이디 검사 중 오류 발생');
  }

  // 성공 시 중복 여부를 나타내는 JSON 데이터를 반환합니다.
  return await response.json();
}
