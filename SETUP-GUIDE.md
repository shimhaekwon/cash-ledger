# 🔧 OpenCode 개발 환경 설정 가이드

## 목적
이 PC의 개발 환경을 다른 PC에서도 동일하게 복원하기 위한 체크리스트입니다.

---

## 1. 기본 정보

| 항목 | 현재 PC 값 |
|------|-----------|
| **Node.js** | v24.13.0 |
| **npm** | 10.9.0 |
| **작업 디렉토리** | D:/OpenCode |
| **앱 디렉토리** | E:/workspace/cash-ledger |
| **Chrome 경로** | C:\Program Files\Google\Chrome\Application\chrome.exe |

---

## 2. 프로젝트 구조

```
D:/OpenCode/              # 루트
├── omfm/                 # OMFM 프로젝트 (AI ensemble)
│   ├── integration-test.js   # 통합 테스트
│   ├── final-test.js         # 최종 테스트
│   ├── TEST-REPORT.md        # 테스트 결과
│   └── README.md             # 문서
│
E:/workspace/cash-ledger/  # 현금 출납부 앱
├── index.html              # 메인
├── app.js                  # 로직
├── styles.css              # 스타일
├── manifest.json           # PWA
├── server.js               # 서버
└── README.md               # 문서
```

---

## 3. NPM 패키지 설치

```bash
# 1. 디렉토리 생성
mkdir -p D:/OpenCode/omfm

# 2. npm 초기화
cd D:/OpenCode/omfm
npm init -y

# 3. puppeteer-core 설치
npm install puppeteer-core
```

---

## 4. GitHub 설정

### 저장소
- **cash-ledger**: https://github.com/shimhaekwon/cash-ledger

### 인증 설정
```bash
git config --global credential.helper store
```

### 복제
```bash
git clone https://github.com/shimhaekwon/cash-ledger.git E:/workspace/cash-ledger
```

---

## 5. 테스트 실행

```bash
# 통합 테스트
node D:/OpenCode/omfm/integration-test.js

# 최종 테스트
node D:/OpenCode/omfm/final-test.js
```

---

## 6. 로컬 서버 실행

```bash
node E:/workspace/cash-ledger/server.js
# 포트: 5000
# IP: ipconfig 확인
```

---

## 7. 새 PC 복원 체크리스트

- [ ] Node.js 설치 (https://nodejs.org)
- [ ] VS Code 설치 (https://code.visualstudio.com)
- [ ] Git 설치 (https://git-scm.com)
- [ ] 프로젝트 복제
- [ ] npm 패키지 설치
- [ ] GitHub 로그인

---

## 8. 현재 설정된 변수

### localStorage 키
- `cash-ledger-data`
- `cash-ledger-categories`

### 기본 분류
```javascript
category1: ['급여', '용돈', '사업수입', '환급', '기타수입']
category2: ['식비', '交通비', '통신비', '의료비', '교육비', '여가비', '쇼핑', '주거비', '기타']
```

---

## 9. 테스트 결과

```
52 passed / 0 failed
- TC-01 ~ TC-28
- 구분 필터, 메모 검색 추가
```

---

## 📞 문제 해결

| 문제 | 해결 |
|------|------|
| 테스트 실패 | Chrome 종료 후 재실행 |
| 서버 연결 실패 | 방화벽 5000포트 허용 |
| Git 푸시 실패 | 자격 증명 재설정 |