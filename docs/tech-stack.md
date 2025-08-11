# 기술 스택 제안

## 프론트엔드
- Next.js 14 (App Router) + TypeScript: 파일 기반 라우팅, SEO, Edge 친화
- Tailwind CSS: 빠른 스타일링, 모바일 우선
- React Hook Form + Zod: 다단계 폼, 타입 안전 검증
- Radix UI/Headless UI(선택): 접근성 보완 컴포넌트
- Chart: `react-chartjs-2` + `chart.js` (간단 추이 시각화)
- 날짜 유틸: `date-fns`

## 백엔드/DB
- Supabase(PostgreSQL): 호스팅형 Postgres, Auth, 스토리지, RLS 정책 지원
- 클라이언트 SDK: `@supabase/supabase-js`
- 데이터 모델: `daily_entries`(카운트/체크/텍스트 배열, 날짜, 타임스탬프)
- 보안: 인증 도입 시 RLS(사용자별 접근 제한) 적용

## 품질/개발
- ESLint + Prettier: 일관된 코드 품질
- Playwright(또는 Cypress): 기본 E2E(페이지 전환/저장 흐름)
- Husky + lint-staged(선택): 커밋 훅 품질 가드

## 배포/운영
- Vercel: Next.js 배포에 최적화
- 환경 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 모니터링(선택): Vercel Analytics 또는 Logflare

## 구조(초안)
- `app/` (Next App Router)
- `app/(routes)/record/step-1`, `step-2`
- `app/history` (히스토리)
- `lib/supabase/client.ts`
- `components/record/*` (폼, 입력 컴포넌트)

## 선택 이유 요약
- 개발 속도: Next + Tailwind + RHF 조합은 생산성이 높음
- 안정성: Supabase로 스키마/정책/호스팅 일원화
- 확장성: 인증/RLS/함수(Edge Functions)로 점진적 확장 용이
