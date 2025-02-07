import { useState } from "react";

const generateLottoNumbers = () => {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    // 보너스 번호 추가 (기존 숫자와 중복되지 않게)
    let bonus;
    do {
        bonus = Math.floor(Math.random() * 45) + 1;
    } while (numbers.has(bonus));

    // 번호를 배열로 변환하고 정렬
    const sortedNumbers = [...numbers].sort((a, b) => a - b);

    return [...sortedNumbers, bonus]; // 6개 숫자 + 보너스 번호 1개
};

export default function LottoGenerator({ isDarkMode }) {
    const [lottoNumbers] = useState(generateLottoNumbers()); // 최초 한 번만 번호 생성

    return (
        <div className={`flex flex-col items-center gap-4 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-xl`}>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>🎰로또 추천 번호</h2>
            <div className="flex gap-2">
                {lottoNumbers.slice(0, 6).map((num, index) => (
                    <div key={index} className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white text-lg font-bold rounded-full">
                        {num}
                    </div>
                ))}
                {/* 보너스 번호 표시 */}
                <div className="w-12 h-12 flex items-center justify-center bg-red-500 text-white text-lg font-bold rounded-full">
                    {lottoNumbers[6]}
                </div>
            </div>
        </div>
    );
}
