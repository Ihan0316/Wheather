// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// localStorage에서 인증 정보를 불러옵니다.
const storedAuth = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth'))
    : null;

const initialState = {
    user: storedAuth?.user || null,
    accessToken: storedAuth?.accessToken || null,
    refreshToken: storedAuth?.refreshToken || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;           // 예: { mid: '사용자 아이디', birthdate: '생년월일', ... }
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            // 로그아웃 시 localStorage에서도 제거
            localStorage.removeItem('auth');
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
