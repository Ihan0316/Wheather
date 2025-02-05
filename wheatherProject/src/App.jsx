import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import OtherCities from './components/widgets/OtherCities';

function App() {
  const location = useLocation(); // 현재 경로 가져오기
  const isFavoritePage = location.pathname.includes('favorite'); // 'favorite' 페이지 여부 확인

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 부드럽게 스크롤 이동
    });
  };

  return (
    <>
      <div className="container mx-auto px-6 md:px-0">
        <Header />
        <Outlet /> 

        <div className="pb-10">
          <div className="mt-10 flex flex-col gap-4 px-6 md:flex-row md:px-0">
            {!isFavoritePage && (
              <div className="mt-4 md:mr-6 md:mt-0">
                <OtherCities />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 플로팅 버튼 추가 */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-3xl text-white shadow-lg hover:bg-blue-600 focus:outline-none"
          onClick={scrollToTop} // 클릭 시 맨 위로 스크롤
        >
          ↑
        </button>
      </div>
    </>
  );
}

export default App;
