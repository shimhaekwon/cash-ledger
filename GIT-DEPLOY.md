# 📦 GitHub 배포 가이드

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 저장소 | https://github.com/shimhaekwon/cash-ledger |
| 파일 수 | 7개 |
| 첫 커밋 | 2026-05-07 |

---

## 📁 배포된 파일

```
E:/workspace/cash-ledger/
├── index.html              # 메인 HTML
├── app.js                  # 앱 로직 (640줄)
├── styles.css              # CSS 스타일
├── manifest.json           # PWA 매니페스트
├── server.js               # 로컬 서버
├── README.md               # 프로젝트 문서
└── generate-test-data.js   # 테스트 데이터 생성
```

---

## 🔄 Git 처리 흐름

```
[작업 디렉토리]
       │
       ▼  git add
[스테이징 영역]
       │
       ▼  git commit
[로컬 저장소 (.git)]
       │
       ▼  git push
[원격 저장소 (GitHub)]
```

---

## 📋 처리 단계별 명령어

### 1. Git 초기화
```bash
cd E:/workspace/cash-ledger
git init
```
→ `.git/` 폴더 생성
→ 현재 디렉토리를 Git 저장소로 변환

---

### 2. 파일 스테이징 (Tracking)
```bash
git add index.html app.js styles.css manifest.json README.md server.js generate-test-data.js
```
→ 파일을 staging area에 추가
→ 아직 추적 안 된 파일만 새로 추가됨

**다른 방법들:**
```bash
git add .                    # 모든 파일 추가
git add *.js                # js 파일만
git add -A                  # 전부 ( tracked + untracked )
```

---

### 3. 커밋 (스냅샷 저장)
```bash
git commit -m "💰 현금 출납부 v1.0 - 모바일 PWA 앱"
```
→ staging 파일을 로컬 저장소에 확정
→ 메시지는 변경内容 요약

**생성된 커밋:**
- Hash: `2f757bb`
- 브랜치: `master` → `main`
- 파일: 7개 (1,641줄)

---

### 4. 원격 저장소 연결
```bash
git remote add origin https://github.com/shimhaekwon/cash-ledger.git
git branch -M main
```
→ `origin`: GitHub 저장소 URL 별칭
→ `main`: 기본 브랜치 이름 (GitHub 기본값)

**원격 확인:**
```bash
git remote -v
# origin  https://github.com/shimhaekwon/cash-ledger.git (fetch)
# origin  https://github.com/shimhaekwon/cash-ledger.git (push)
```

---

### 5. 푸시 (업로드)
```bash
git push -u origin main
```
→ `-u`: upstream 설정 (다음부터 `git push`만 입력可)
→ GitHub에 코드 업로드

---

## 🔐 인증 설정 (처음.Push時)

### 1. GitHub에서 토큰 생성
1. https://github.com/settings/tokens
2. `Generate new token`
3. `repo` 권한 체크
4. 토큰 복사

### 2. PowerShell에서 자격 증명 저장
```bash
git config --global credential.helper store
```

### 3. Push時 입력
```
Username: shimhaekwon
Password: [Personal Access Token粘贴]
```

→ 이후 자동 기억

---

## 🔄 추가 작업 흐름

### 코드 수정 후
```bash
git add .
git commit -m "수정 내용"
git push
```

### 다른 PC에서 복제
```bash
git clone https://github.com/shimhaekwon/cash-ledger.git
```

### 최신 코드 가져오기
```bash
git pull origin main
```

---

## 📊 Git 상태 확인

```bash
git status              # 파일 상태
git log --oneline       # 커밋 이력 (한 줄)
git diff                # 변경 내용
git branch -a           # 모든 브랜치
```

---

## ⚠️ 주의사항

| 상황 | 설명 |
|------|------|
| `.env` 파일 | 절대 push 안 함 (API 키 등) |
| `node_modules/` | `.gitignore`에 추가 권장 |
| 큰 파일 | 50MB 이상 Git LFS 사용 |

---

## 📝 프로젝트 커밋 이력

| 해시 | 메시지 | 파일 수 |
|------|--------|---------|
| `2f757bb` | 💰 현금 출납부 v1.0 - 모바일 PWA 앱 | 7 |

---

## 🛠️ 유용한 Git 명령어

```bash
# 상태 확인
git status

#ステージング 취소
git reset HEAD 파일명

# 직전 커밋 수정
git commit --amend -m "새 메시지"

# 브랜치 생성
git checkout -b feature/새기능

# 브랜치 전환
git checkout main

# 병합
git merge feature/새기능

#stash (임시 저장)
git stash
git stash pop
```

---

## 🌐 GitHub Pages 활성화 (선택)

1. https://github.com/shimhaekwon/cash-ledger/settings
2. Pages → Source: `main` branch
3. `https://shimhaekwon.github.io/cash-ledger/` 에서 호스팅

> **참고**: PWA는 HTTPS 필요 → GitHub Pages 자동 제공