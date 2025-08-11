# Emotion Tracker

하루의 선택과 감정을 기록하고 변화 추이를 확인하는 웹 앱.

## 구성 문서
- 요구사항: `docs/requirements.md`
- 기술 스택: `docs/tech-stack.md`
- DB 스키마: `supabase/schema.sql`

## macOS에서 시작하기
- 기본 셸: `/bin/zsh` 기준 안내입니다. (Terminal.app 또는 iTerm2 권장)

### 1) 필수 도구 설치
- Node.js LTS 설치(선호: nvm)
```bash
# Homebrew가 없다면 (선택)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# nvm 설치
brew install nvm
mkdir -p ~/.nvm && echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc && \
  echo 'source $(brew --prefix nvm)/nvm.sh' >> ~/.zshrc && source ~/.zshrc

# Node LTS 설치 및 사용
nvm install --lts
nvm use --lts
node -v && npm -v
```

### 2) 의존성 설치
```bash
cd /Users/cylee/Develop/emotion-tracker/web
npm install
```

### 3) 환경 변수 설정
```bash
cd /Users/cylee/Develop/emotion-tracker/web
cp .env.local.example .env.local
# 편집기로 열어 값 입력
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
- Supabase 프로젝트 대시보드에서 URL/Anon Key 확인 후 `.env.local`에 입력하세요.

### 4) 데이터베이스 스키마 적용(Supabase)
- Supabase SQL Editor에서 아래 파일 내용을 실행
  - `supabase/schema.sql`
- v1(익명 사용) 정책 포함: `user_id IS NULL`인 행에 대해 `anon` insert/select 허용 정책이 포함되어 있습니다.

### 5) 개발 서버 실행
```bash
cd /Users/cylee/Develop/emotion-tracker/web
npm run dev
# 브라우저: http://localhost:3000
```

### 6) 프로덕션 빌드/실행
```bash
cd /Users/cylee/Develop/emotion-tracker/web
npm run build
npm start
```

## 디렉터리(현재)
- `web/src/app/record/step-1` — 1단계(숫자/체크)
- `web/src/app/record/step-2` — 2단계(텍스트 3+3)
- `web/src/app/history` — 히스토리 리스트 + 간단 차트
- `web/src/lib/supabase/client.ts` — Supabase 브라우저 클라이언트
- `web/src/lib/storage.ts` — 1단계 값 sessionStorage 저장/로드

## 문제 해결(맥 전용 팁)
- 빌드 시 "Supabase env vars are missing": `.env.local`에 URL/Anon Key를 채우고 서버를 재시작하세요.
- INSERT 거부(RLS): v1 익명 정책이 적용되었는지 확인하거나, 인증 도입 시 `user_id`와 RLS를 사용하세요.
- 에디터 내 PowerShell 출력: macOS 기본 셸은 zsh입니다. 통합 터미널에서 zsh 프로파일을 선택하거나 Terminal.app에서 명령을 실행하세요.
