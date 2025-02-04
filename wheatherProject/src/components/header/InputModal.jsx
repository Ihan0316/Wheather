// InputModal.jsx
import React from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';

const InputModal = ({ userInputs, setUserInputs, onSubmit, onClose }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({
      ...prev,
      [name]: name === 'mbti' ? value.toUpperCase() : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white dark:bg-neutral-800">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-white">
              생년월일 입력
            </h2>
            <button
              onClick={onClose} // X 버튼 클릭 시 onClose 호출
              className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              type="button"
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="mbti"
              value={userInputs.mbti}
              onChange={handleInputChange}
              placeholder="MBTI (예: INTJ)"
              className="rounded border p-2 text-sm text-black dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              maxLength={4}
            />
            <input
              type="number"
              name="birthYear"
              value={userInputs.birthYear}
              onChange={handleInputChange}
              placeholder="년도"
              className="rounded border p-2 text-sm text-black dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
            />
            <input
              type="number"
              name="birthMonth"
              value={userInputs.birthMonth}
              onChange={handleInputChange}
              placeholder="월"
              className="rounded border p-2 text-sm text-black dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              min="1"
              max="12"
            />
            <input
              type="number"
              name="birthDay"
              value={userInputs.birthDay}
              onChange={handleInputChange}
              placeholder="일"
              className="rounded border p-2 text-sm text-black dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              min="1"
              max="31"
            />
            <select
              name="gender"
              value={userInputs.gender}
              onChange={handleInputChange}
              className="rounded border p-2 text-sm text-black dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
            >
              <option value="">성별</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
            <div className="mt-4 flex justify-end">
              <button
                onClick={onSubmit} // 확인 버튼 클릭 시 onSubmit 호출
                className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                type="button"
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
