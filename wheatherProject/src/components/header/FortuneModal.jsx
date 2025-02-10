import React from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import LottoGenerator from '../LottoGenerator'; // 로또 컴포넌트 import

export const FortuneModal = ({ fortune, onClose }) => {
  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="animate-slideUp max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-neutral-800">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">오늘의 운세</h2>
            <button
              onClick={onClose}
              className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </div>

          {/* 운세 결과 출력 */}
          <div className="prose dark:prose-invert max-w-none whitespace-pre-line text-sm leading-6">
            {fortune}
          </div>

          {/* 행운의 번호 섹션 */}
          <div className="mt-6 text-center">
            <LottoGenerator /> {/* 여기서 로또 번호 표시 */}
          </div>

          {/* 닫기 버튼 */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
