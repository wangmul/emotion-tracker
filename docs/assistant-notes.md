# Assistant Notes (Internal)

- 사용자 언어: 한국어
- 핵심 플로우: 2단계 기록(숫자/체크 → 텍스트 3+3) → DB 저장 → 히스토리
- 모호성 처리: 텍스트 입력은 "세가지"를 명확히 3필드로 구현(가변 개수는 후속)
- 인증: v1 단일 사용자 또는 임시, v2 Supabase Auth + RLS
- DB: `daily_entries`(정수 3, 불리언 1, 텍스트배열 2, 날짜 1, 타임스탬프 2, user_id 준비)
- 배포: Vercel 가정, Supabase 연결
- 우선순위: 입력 UX/검증 → 저장 안정성 → 히스토리 가시화
