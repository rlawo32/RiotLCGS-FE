## 🏆 Riot LCGS(League of Legends Custom Game Save) - Front

리그오브레전드의 커스텀 게임 History 데이터 추출 및 입력창

<br/>

## 📖 LCG 프로젝트 : LCGS-FE 소개

LCG 프로젝트는 기존 리그오브레전드 전적 사이트에서 커스텀 게임에 대한 기록 확인이 불가하기에 직접 내가 했던 커스텀 게임들을 기록으로 남기고 전적 사이트처럼 구성하고자 시작하게 되었습니다.

LCG 프로젝트 중 LCGS-FE는 로컬에서만 활용이 가능한 서비스로 leauge-connect 라이브러리를 통해 리그오브레전드 클라이언트와 LCU API 통신을 통해 특정 게임의 History 데이터를 JSON으로 전달받고 해당 데이터를 LCGS-BE로 전달하는 기능을 담당하고 있습니다. <br/>
또한, 게임 History 데이터 전달 말고도 플레이어 별로 게임 데이터를 토대로 라인을 계산하고 실제 랭크 데이터를 추출하여 추가 JSON으로 구성하는 등의 기능도 구현되어 있습니다.

<br/>

## 📅 개발 기간

+ `2024. 12. 06. ~ ing`

<br/>

## 📋 구현 목록

+ LCU API 통신 체크 ✅ <br/>
+ 게임 HISTORY 데이터 추출 ✅ <br/>
+ 통신 결과 데이터 LCGS-BE 전송 ✅ <br/>
+ LOL 클라이언트 구동 체크 ✅ <br/>
+ 플레이어 별 랭크 데이터 추출 ✅ <br/>
+ 플레이어 별 라인 계산 추출 ✅ <br/>
+ 플레이어 입력 후 해당 데이터 JSON으로 변환 후 저장 🚧 <br/>
+ Electron 앱 개발 (LCGS-FE + LCGS-BE) 🚧 <br/>

<br/>

## 🛠️ 사용 툴, 언어

+ Visual Studio Code
+ NextJS

<br/>

## 🔗 참고 사이트

+ API Swagger 사이트 - [LCU API SWAGGER](https://swagger.dysolix.dev/lcu/) <br/>
+ npm 라이브러리 - [LEAGUE-CONNECT LIB](https://www.npmjs.com/package/league-connect?activeTab=code)
