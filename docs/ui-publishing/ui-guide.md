# UI 가이드 — 피드백 컴포넌트 규칙

화면에서 사용자에게 **액션 결과를 알리는 피드백·알림 컴포넌트**의 종류와 적용 규칙을 정의한다.

## 1. 컴포넌트 종류와 적용 규칙

| 컴포넌트 | 용도 | 적용 시점 |
| --- | --- | --- |
| **Toast** | 짧은 일시 알림 | 액션 성공/실패/정보/경고 |
| **Confirm Modal** | 파괴적 액션 재확인 | 삭제·차단 등 되돌릴 수 없는 액션 |
| **Inline validation** | 폼 입력값 검증 오류 | 필드 단위 검증 실패 |
| **Empty state** | 데이터 없음 표시 | 목록이 비어 있을 때 |
| **Error page** | 페이지 단위 오류 | 4xx/5xx (별도 화면) |

### 적용 규칙

1. **성공** → Toast(`success`), 비파괴적 액션(등록/수정/임시저장)
2. **파괴적 액션**(삭제·차단) → Confirm Modal → 성공 시 Toast
3. **폼 오류** → Inline validation(해당 필드 하단) + 필요 시 Toast(`error`)
4. **로그인 실패** → Inline + Toast
5. **데이터 없음** → Empty state(게시글 목록 등)

## 2. 컴포넌트 명세

### 2.1 Toast (일시 알림)

- 타입: `success` / `error` / `info` / `warning`
- 마크업: `.toast-container` + `.toast.toast--{type}` + `.toast__message`
- 접근성: success·info → `role="status"`(polite), error → `role="alert"`(assertive)
- 동작: `showToast(message, type)` → 우측 상단 고정, 약 3초 후 자동 제거

### 2.2 Confirm Modal (확인 대화상자)

- 마크업: `.modal` + `.modal__overlay` + `.modal__dialog`
- 접근성: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- 동작
  - 열기: `data-modal-open="모달ID"`
  - 닫기: `data-modal-close` 버튼 / 오버레이 클릭 / `Esc`
  - 확인(OK): `data-modal-close` + 실제 액션은 백엔드 연동 시 추가

### 2.3 Inline validation (인라인 검증)

- 마크업: `.field` > `.field__label` + `.field__input`(+ `--error`) + `.field__error`
- 접근성: `aria-invalid="true"`, `aria-describedby`, 오류는 `role="alert"`

### 2.4 Empty state (빈 상태)

- 마크업: `.empty` > `.empty__title` + `.empty__desc`(+ 액션 버튼)
- 예: "게시글이 없습니다" + "글쓰기" 버튼

## 3. 기존 화면 적용 현황

| 화면 | 적용 |
| --- | --- |
| 게시글 상세 | 삭제 버튼 + Confirm Modal |
| 회원가입 | Inline validation 예시(비밀번호 확인) |
| 로그인 | `.field` 구조 적용 |
| 게시글 목록 | Empty state 패턴 (데모에서 확인) |

## 4. 기술

- HTML + SCSS(BEM) + 최소 JS (외부 라이브러리 없음 — D-10)
- 데모 화면: `ui/html/components.html`