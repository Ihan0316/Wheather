import React from 'react';

const InputModal = ({ userInputs, setUserInputs, onClose }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInputs(prev => ({
            ...prev,
            [name]: name === 'mbti' ? value.toUpperCase() : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">생년월일 입력</h2>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            name="mbti"
                            value={userInputs.mbti}
                            onChange={handleInputChange}
                            placeholder="MBTI (예: INTJ)"
                            className="p-2 border rounded text-sm text-black"
                            maxLength={4}
                        />
                        <input
                            type="number"
                            name="birthYear"
                            value={userInputs.birthYear}
                            onChange={handleInputChange}
                            placeholder="년도"
                            className="p-2 border rounded text-sm text-black"
                        />
                        <input
                            type="number"
                            name="birthMonth"
                            value={userInputs.birthMonth}
                            onChange={handleInputChange}
                            placeholder="월"
                            className="p-2 border rounded text-sm text-black"
                            min="1"
                            max="12"
                        />
                        <input
                            type="number"
                            name="birthDay"
                            value={userInputs.birthDay}
                            onChange={handleInputChange}
                            placeholder="일"
                            className="p-2 border rounded text-sm text-black"
                            min="1"
                            max="31"
                        />
                        <select
                            name="gender"
                            value={userInputs.gender}
                            onChange={handleInputChange}
                            className="p-2 border rounded text-sm text-black"
                        >
                            <option value="">성별</option>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </select>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputModal;
