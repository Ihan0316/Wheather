import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { registerAPI, checkMidAPI } from "../../services/AuthAPI";

const MBTI_TYPES = [
    "ISTJ", "ISFJ", "INFJ", "INTJ",
    "ISTP", "ISFP", "INFP", "INTP",
    "ESTP", "ESFP", "ENFP", "ENTP",
    "ESTJ", "ESFJ", "ENFJ", "ENTJ"
];

const RegisterModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        mid: "",
        mpw: "",
        name: "",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
        mbti: "",
        gender: "",
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "mid") {
            if (value.length < 3 || value.length > 12) {
                setError("아이디는 3~12 글자 사이여야 합니다.");
            } else {
                setError(null);
            }
        }

        if (name === "mpw") {
            if (value.length < 8) {
                setError("비밀번호는 8자 이상이어야 합니다.");
            } else {
                setError(null);
            }
        }

        if (name === "mbti") {
            newValue = value.toUpperCase();
            if (!MBTI_TYPES.includes(newValue) && newValue !== "") {
                setError("올바른 MBTI 유형을 선택하세요.");
            } else {
                setError(null);
            }
        }

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const handleSubmit = async () => {
        const { mid, mpw, birthYear, birthMonth, birthDay, mbti, gender } = formData;

        if (mid.length < 3 || mid.length > 12) {
            setError("아이디는 3~12 글자 사이여야 합니다.");
            return;
        }

        if (mpw.length < 8) {
            setError("비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        if (!MBTI_TYPES.includes(mbti)) {
            setError("올바른 MBTI 유형을 선택하세요.");
            return;
        }

        if (!birthYear || !birthMonth || !birthDay) {
            setError("생년월일을 모두 선택해주세요.");
            return;
        }

        if (!gender) {
            setError("성별을 선택해주세요.");
            return;
        }

        try {
            const exists = await checkMidAPI(mid);
            if (exists) {
                setError("이미 사용 중인 아이디입니다.");
                return;
            }
        } catch (err) {
            setError("아이디 확인 중 오류 발생");
            return;
        }

        const birthdate = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;
        const userData = { ...formData, birthdate };

        try {
            await registerAPI(userData);
            setSuccess("회원가입을 축하합니다!");
            setError(null);
            setTimeout(() => onClose(), 1000);
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
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" type="button">
                            <IoCloseCircleOutline size={24} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            name="mid"
                            value={formData.mid}
                            onChange={handleChange}
                            placeholder="아이디 (3~12자)"
                            className="rounded border p-2 text-sm text-black"
                        />
                        <input
                            type="password"
                            name="mpw"
                            value={formData.mpw}
                            onChange={handleChange}
                            placeholder="비밀번호 (8자 이상)"
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

                        <div className="flex gap-2">
                            <select name="birthYear" value={formData.birthYear} onChange={handleChange} className="rounded border p-2 text-sm text-black">
                                <option value="">연도</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} className="rounded border p-2 text-sm text-black">
                                <option value="">월</option>
                                {months.map((month) => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <select name="birthDay" value={formData.birthDay} onChange={handleChange} className="rounded border p-2 text-sm text-black">
                                <option value="">일</option>
                                {days.map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <select name="mbti" value={formData.mbti} onChange={handleChange} className="rounded border p-2 text-sm text-black">
                            <option value="">MBTI 선택</option>
                            {MBTI_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <select name="gender" value={formData.gender} onChange={handleChange} className="rounded border p-2 text-sm text-black">
                            <option value="">성별 선택</option>
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                        </select>

                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {success && <div className="text-green-500 text-sm">{success}</div>}

                        <button onClick={handleSubmit} className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600" type="button">
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;
