import React, { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { loginAPI } from '../../services/AuthAPI';

const LoginModal = ({ onClose }) => {
    const [credentials, setCredentialsState] = useState({ mid: '', mpw: '' });
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setCredentialsState({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            const data = await loginAPI(credentials);
            console.log("Received token data:", data);
            console.log("AccessToken string:", data.accessToken);

            if (!data.accessToken || data.accessToken.split('.').length !== 3) {
                throw new Error("토큰 형식이 올바르지 않습니다.");
            }

            const { jwtDecode } = await import('jwt-decode');
            const decoded = jwtDecode(data.accessToken);
            console.log('Decoded token:', decoded);

            dispatch(
                setCredentials({
                    user: {
                        mid: decoded.mid,
                        birthdate: decoded.birthdate,
                        mbti: decoded.mbti,
                        gender: decoded.gender,
                    },
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                })
            );
            onClose();
        } catch (err) {
            console.error('로그인 처리 중 오류:', err);
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white text-black">
                <div className="p-6">
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
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
