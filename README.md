# 날씨 앱 ✨

React와 Vite로 제작된 간단한 날씨 애플리케이션입니다. 사용자가 도시를 검색하여 해당 지역의 현재 날씨 상태를 확인할 수 있습니다.

## 주요 기능

- 도시 이름으로 날씨 정보 검색
- 온도, 습도, 풍속 등 현재 날씨 정보 확인
- 선택한 지역의 5일 예보 확인
- Chart.js를 사용한 향후 6시간 동안의 강수 확률 차트 보기

## 사용된 라이브러리

이 프로젝트는 다음과 같은 라이브러리를 사용합니다:

### 프론트엔드 🎨

- tailwind CSS - 유틸리티 우선 CSS 프레임워크
- react-redux - React에서 Redux를 사용하기 위한 바인딩 제공
- reduxjs/toolkit - Redux 사용 사례를 단순화하는 유틸리티 제공
- react-router-dom - React Router를 위한 DOM 바인딩
- axios - 브라우저를 위한 Promise 기반 HTTP 클라이언트
- chart.js - 다양한 차트 유형을 만들 수 있는 유연한 JavaScript 차트 라이브러리
- classnames - 클래스명을 조건부로 결합하는 JavaScript 유틸리티
- react-icons - React 프로젝트를 위한 무료 아이콘 세트

### 백엔드 ⚒️

- Github Pages
- Spring Boot

### 사용된 API

이 프로젝트는 다음과 같은 API들을 사용합니다:

- OpenWeather API - 특정 위치의 날씨 데이터 및 지도 레이어 제공
- OpenMeteo API - 특정 위치의 자외선 지수 데이터 제공

## 설치 방법

이 애플리케이션을 로컬에서 실행하려면 React-vite가 설치되어 있어야 합니다. 이 저장소를 클론한 후, 프로젝트 디렉토리(Wheather Project)로 이동하여 다음 명령어를 실행하세요:

- yarn
- yarn dev

Docker 실행 후, 
서버(Wheather Back)로 이동 후 실행을 하면, DB가 생성됩니다.

이렇게 하면 필요한 종속성이 설치되고 로컬 개발 서버가 시작됩니다.

** api 키는 개별 발급 부탁드립니다.
https://openweathermap.org/appid

## 사용 방법

이 애플리케이션을 사용하려면 검색창에 도시 이름을 입력하고 "Enter" 키를 누르면 됩니다. 해당 도시의 현재 날씨 상태가 표시됩니다.
또한 로그인 후 이용하시면, 오늘의 운세 기능, 즐겨찾기 기능도 이용하실 수 있습니다.
