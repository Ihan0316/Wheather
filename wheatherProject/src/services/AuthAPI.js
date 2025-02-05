// src/services/AuthAPI.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function loginAPI({ mid, mpw }) {
    const response = await fetch(`${API_BASE_URL}/generateToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mid, mpw }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || '로그인 실패');
    }
    return await response.json(); // { accessToken, refreshToken } 반환
}

export async function registerAPI(userData) {
    // userData: { mid, mpw, name, birthdate, mbti, gender }
    const response = await fetch(`${API_BASE_URL}/member/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입 실패');
    }
    return await response.text(); // "회원가입 성공" 등의 메시지 반환
}

export async function checkMidAPI(mid) {
    const response = await fetch(
        `${API_BASE_URL}/member/check-mid?mid=${encodeURIComponent(mid)}`,
        { method: 'GET' }
    );
    if (!response.ok) {
        throw new Error('아이디 검사 중 오류 발생');
    }
    return await response.json(); // true(중복) 또는 false(사용 가능) 반환
}
