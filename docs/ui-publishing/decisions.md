# 결정 기록 (Decisions)

`ui-publishing` 시도의 기술·구조 결정을 기록한다.

## 확정된 결정

### D-01 — 스타일 기술: SCSS + Tailwind CSS
- **결정**: 스타일링은 SCSS와 Tailwind CSS를 함께 사용한다.
- **이유**: SCSS로 구조적(sass) 스타일링 흐름을, Tailwind로 utility-first 스타일링 흐름을 함께 학습한다.
- **영향**: npm 빌드(D-04)로 통합한다.

### D-02 — 코드 위치: ui/
- **결정**: 퍼블리싱 산출물은 `ui/` 디렉토리에 둔다.
- **구조**: `ui/font/`, `ui/image/`, `ui/css/`, `ui/js/`
- **이유**: 시도 단위는 브랜치로 구분하되, 이 시도 내부 산출물은 `ui/`로 모아 관리한다.

### D-03 — 반응형 기준: desktop-first (web 기반)
- **결정**: 반응형 화면이지만 **데스크톱(web)을 기본**으로 두고, 좁은 화면에 맞춰 내려가는 desktop-first 방식이다.
- **이유**: 게시판 도메인의 주 사용 환경이 desktop이며, "기반은 web"이라는 방침에 따른다.
- **영향**: breakpoint는 D-05 기준(`max-*` 위주)으로 활용한다.

## 확정된 결정 (기록 보완)

### D-04 — Tailwind + SCSS 통합: npm 빌드
- **결정**: `package.json` 기반 npm 빌드를 사용한다 (tailwindcss + postcss + autoprefixer + sass).
- **이유**: 프레임워크 학습 전 실제 프론트 빌드 파이프라인 흐름을 익힌다.

### D-05 — 반응형 브레이크포인트 (desktop-first)
- **결정**: Desktop 기본, Tablet `≤ 1024px`, Mobile `≤ 640px`.
- **방법**: Tailwind `max-*` 변형 + SCSS `respond-to()` mixin을 사용한다.

### D-06 — CSS 클래스 네이밍
- **결정**: SCSS 컴포넌트 클래스는 BEM, 레이아웃·간격은 Tailwind utility를 병행한다.

### D-07 — 웹 폰트
- **결정**: Pretendard를 `ui/font/`에 자체호스팅(`@font-face`)한다.

### D-08 — 이미지
- **결정**: 로컬 placeholder(SVG/샘플)를 `ui/image/`에 둔다.

### D-09 — JS 범위
- **결정**: 최소 JS. 모바일 nav 토글 등 보조 동작만 Vanilla(ES2015+)로 작성한다.

### D-10 — UI 피드백 컴포넌트: 직접 구현
- **결정**: 알림/피드백 UI(Toast·Confirm Modal·Inline validation·Empty state)를 외부 라이브러리 없이 **HTML + SCSS(BEM) + 최소 JS**로 직접 구현한다.
- **이유**: 기술 학습이 목적이므로 라이브러리 도입 전에 구현 원리를 익힌다. D-09(최소 JS) 범위 내에서 모듈화한다.
- **산출물**: `ui/`의 toast·modal·field·empty 컴포넌트 + `docs/ui-publishing/ui-guide.md`.
