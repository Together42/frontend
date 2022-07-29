## 친해지길 바라!

<p align='center'>
<img width='60%' src='https://user-images.githubusercontent.com/79993356/166676961-f63a6a06-c086-47f3-ac7d-16c45458d99a.svg'>
</p>

<p align='center'>
<span>🖥 For Client</sapn>
</p>

<p align='center'>
    <img src="https://img.shields.io/badge/React-v17.0.1-blue?logo=React"/>
    <img src="https://img.shields.io/badge/Recoil-v0.7.2-000000?style=flat&logo=Coil"/>
    <img src="https://img.shields.io/badge/Sass-v1.50.0-CC6699?style=flat&logo=Sass"/>
    <img src="https://img.shields.io/badge/SWR-v9.6.8-F7DF1E?style=flat-square&logo=SWC&logoColor=white"/>
    <img src="https://img.shields.io/badge/Typescript-v4.0.5-blue?logo=typescript"/>
    <img src="https://img.shields.io/badge/GitHub Pages-v3.2.3-222222?style=flat&logo=GitHub Pages&logoColor=white"/>
    <img src="https://img.shields.io/badge/babel-v7.17.5-F9DC3E?logo=babel">
    <img src="https://img.shields.io/badge/Webpack-v5.70.0-8DD6F9?logo=Webpack">
</p>

<p align='center'>
<span>🔐 For Server</sapn>
</p>

<p align='center'>
    <img src="https://img.shields.io/badge/node.js-v14.15.1-green?logo=Node.js"/>
    <img src="https://img.shields.io/badge/JavaScript-deploy-F7DF1E?logo=JavaScript"/>
    <img src="https://img.shields.io/badge/Express-v4.17.3-green?style=flat&logo=Express&logoColor=white"/>
    <img src="https://img.shields.io/badge/Amazon AWS-deploy-FF9900?logo=Amazon AWS">
    <img src="https://img.shields.io/badge/JSON Web Tokens-deploy-CC2927?logo=JSON Web Tokens">
    <img src="https://img.shields.io/badge/MySQL-v8.0.28-4479A1?logo=MySQL">
    <img src="https://img.shields.io/badge/GitHub Actions-deploy-5B0BB5?logo=GitHub Actions">
    <img src="https://img.shields.io/badge/Slack-alert-4A154B?logo=Slack">
</p>

## 🏠 [HOME PAGE](https://together42.github.io/frontend/)

정기적으로 **20명**이 넘는 동아리원(사서)님들을 무작위 매칭 후, 친해질 수 있는 활동을 함께 하도록 돕는 페이지입니다. 매칭에 대한 **후기를 SNS**처럼 남길 수도 있습니다. 현재 React 에 대한 경험이 없는 팀원들을 직접 가르쳐드리며, 프로젝트 참여를 독려 중입니다.

## 📌 서비스 소개

### 🙋 원하는 이벤트에 참여

> - 이벤트 목록에서 자신이 원하는 이벤트에 자유롭게 참가할 수 있습니다.
> - 많은 이벤트에 참여할 수 있으며, 참석 취소도 가능합니다.

### 🤝 직접 이벤트 생성

> - 자신이 원하는 모임을 자유롭게 만들어 신청을 유도할 수 있습니다.
> - 저녁을 같이 먹을 사람을 구하는 사적인 모임 모집!
> - 프로젝트원을 구하는 공적인 모임까지 생성할 수 있습니다.

### 🔖 게시글 작성

> - 자신이 참여한 모임의 사진 및 동영상을 업로드 할 수 있습니다.
> - 태그가 된 사람에게는 Slack 메시지가 갑니다.
> - 게시글에 대한 댓글을 달 수 있습니다.

### 👾 개성 있는 프로필 사진

> - 자신이 원하는 프로필 사진을 골라 사용합니다.
> - 무려 28가지의, 다양한 성별과 나이대의 프로필을 제공합니다.

## 📌 시연 영상

[<img src="https://user-images.githubusercontent.com/79993356/180823382-e58c4789-51f8-4f90-984d-cc2232946058.png" width="400"></img>](https://youtu.be/rHi_RF20q-o)
[<img src="https://user-images.githubusercontent.com/79993356/180823397-f4f779d0-87fb-4477-87a9-5e958aad3b54.png" width="400"></img>](https://youtu.be/KKyxH8Ll7k0)

## 📌 페이지 스크린샷 및 해설

![0003](https://user-images.githubusercontent.com/79993356/180824079-c2530c1c-bb31-48e7-bb24-b8145afb12b1.jpg)
![0004](https://user-images.githubusercontent.com/79993356/180824111-529cb62b-5536-4c49-8529-70e1c995b75e.jpg)
![0005](https://user-images.githubusercontent.com/79993356/180824120-dac33db6-4d08-41c4-8795-03dc106369c9.jpg)
![0006](https://user-images.githubusercontent.com/79993356/180824127-ee4a294a-ff76-4610-9c79-cc39261761a3.jpg)
![0007](https://user-images.githubusercontent.com/79993356/180824129-ee1ab6a4-a513-493b-a48a-98eeda77cb71.jpg)

## ⚙️ 프로젝트 구동 방법

프론트 코드와 백엔드 코드 모두 클론합니다.

[백엔드 코드](https://github.com/Together42/backend)

**1. MySQL 다운로드 후 워크벤치에 DB 스키마 설계 후 실행**

**2. 백엔드**
- 백엔드 환경 변수 설정
  - backend폴더 바로 안에 .env 파일 생성
  - .env 예시
    ```
    DB_DATABASE=...
    DB_USER=...
    DB_PASSWORD=...
    DB_HOST=...
    DB_PORT=...
    JWT_SECRET=...
    JWT_EXPIRES_SEC=...
    BCRYPT_SALT_ROUNDS=...
    HOST_PORT=...
    HOSTNAME=...
    ACCESS_KEY_ID=...
    SECRET_ACCESS_KEY=...
    REGION=...
    NAVER_ID=...
    NAVER_PW=...
    BOT_USER_OAUTH_ACCESS_TOKEN=...
    SLACK_JIP=...
    SLACK_TKIM=...
    ```
  - 실행
    ```jsx
    npm install
    npm run dev
    ```

**3. 프론트엔드**
- 프론트엔드 환경 변수 설정
   - 폴더에 .env 파일 생성
   - .env 예시
      ```
      DEPLOY_ADR=...
      DEV_ADR=...
      ```
  - 실행
    ```jsx
    npm install
    npm run dev
    ```
