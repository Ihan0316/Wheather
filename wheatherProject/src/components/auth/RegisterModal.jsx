import React, { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { registerAPI, checkMidAPI } from '../../services/AuthAPI';

const RegisterModal = ({ onClose }) => {
    // 생년월일은 별도의 select로 입력받기 위해 birthYear, birthMonth, birthDay로 상태 분리
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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // 연도 옵션: 현재 연도부터 1900년까지 내림차순으로 생성
    const currentYear = new Date().getFullYear();
    let years = [];
    for (let y = currentYear; y >= 1900; y--) {
        years.push(y);
    }
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        // 아이디 중복 여부 체크
        try {
            const exists = await checkMidAPI(formData.mid);
            if (exists) {
                setError('이미 사용 중인 아이디입니다.');
                return;
            }
        } catch (err) {
            setError('아이디 확인 중 오류 발생');
            return;
        }

        // 생년월일 입력이 모두 되었는지 체크
        const { birthYear, birthMonth, birthDay } = formData;
        if (!birthYear || !birthMonth || !birthDay) {
            setError('생년월일을 모두 선택해주세요.');
            return;
        }
        // 월, 일이 2자리 수로 변환 (예: 5 → 05)
        const monthPadded = birthMonth.toString().padStart(2, '0');
        const dayPadded = birthDay.toString().padStart(2, '0');
        const birthdate = `${birthYear}-${monthPadded}-${dayPadded}`;

        // API 전송 데이터 구성 (생년월일은 "YYYY-MM-DD" 형태)
        const userData = {
            mid: formData.mid,
            mpw: formData.mpw,
            name: formData.name,
            birthdate: birthdate,
            mbti: formData.mbti,
            gender: formData.gender,
        };

        try {
            await registerAPI(userData);
            setSuccess('회원가입을 축하합니다!');
            setError(null);
            // 2초 후 모달 자동 닫기
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            {/* 기입부분 외의 텍스트는 검은색으로 지정 */}
            <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white text-black">
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">회원가입</h2>
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
                            value={formData.mid}
                            onChange={handleChange}
                            placeholder="아이디"
                            className="rounded border p-2 text-sm text-black"
                        />
                        <input
                            type="password"
                            name="mpw"
                            value={formData.mpw}
                            onChange={handleChange}
                            placeholder="비밀번호"
                            className="rounded border p-2 text-sm text-black"
                        />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="이름"
                            className="rounded border p-2 text-sm text-black"
                        />
                        {/* 생년월일을 연, 월, 일을 별도의 select로 처리 */}
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
                        <input
                            type="text"
                            name="mbti"
                            value={formData.mbti}
                            onChange={handleChange}
                            placeholder="MBTI (예: INTJ)"
                            className="rounded border p-2 text-sm text-black"
                        />
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="rounded border p-2 text-sm text-black"
                        >
                            <option value="">성별</option>
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                            <option value="Other">Other</option>
                        </select>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {success && <div className="text-green-500 text-sm">{success}</div>}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                type="button"
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;
