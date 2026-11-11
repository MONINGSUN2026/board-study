# board-study

> web 기술, 도구 등을 학습하고 시범 사용해보며 흐름을 익히는 실습 프로젝트

## 목적

게시판(Board)을 직접 구현하는 과정을 통해 다양한 web 기술 스택과 도구의
**사용법·구조·흐름**을 몸으로 익히는 것이 1차 목표다.
단순 TODO 앱이 아닌, 실제 서비스에 가까운 게시판 도메인을 기준으로
여러 기술들을 단계적으로 갈아 끼우며 비교/학습한다.

## 로컬 개발 환경

학습에 필요한 DB는 Docker Compose로 구성한다. 상세 구성·연결·운영은 `docs/common/database.md`를 참조한다.

### 사전 요구사항
- Docker Desktop (또는 Docker Engine + Compose v2)

### 기동

```bash
cd docker
docker compose up -d
```

### 구성

| 서비스 | 컨테이너 | 포트 | DB | 앱 계정 |
| --- | --- | --- | --- | --- |
| PostgreSQL 16 | `postgres` | `5432` | `board` | `board_app` / `app1234` |
| MongoDB 7 | `mongo` | `27017` | `board` | `board_app` / `app1234` |

### 중지·초기화

```bash
cd docker
docker compose stop      # 중지 (데이터 유지)
docker compose down      # 컨테이너 제거 (볼륨 유지)
docker compose down -v   # 볼륨까지 제거 (완전 초기화)
```

> 프레임워크 실습 시 위 앱 계정으로 바로 연결한다. 상세 연결 URL은 `docs/common/database.md` 참조.

## 웹 화면 (UI)

웹 화면 구현 시 재사용할 **퍼블리싱 자산**을 `ui/`에 둔다.
프레임워크로 화면을 구현할 때 이 마크업·스타일·컴포넌트를 참조한다.
상세 설계는 `docs/ui-publishing/`을 참조한다.

### 구조

```text
ui/
├── html/                 # 화면 마크업 (메뉴 단위 분류)
│   ├── board/            # 게시판 (목록·상세·작성)
│   ├── auth/             # 회원 (로그인·가입)
│   ├── my/               # 내 정보
│   ├── admin/            # 관리자
│   ├── error/            # 오류 페이지 (400/401/403/404/500/기타)
│   └── components.html   # UI 컴포넌트 데모
├── css/                  # SCSS 소스 (+ 빌드 산출 main.css)
├── js/                   # 공통 JS (최소 인터랙션)
├── image/                # 이미지·로고
└── font/                 # 웹 폰트
```

### 기술

- **SCSS + Tailwind CSS** (desktop-first: tablet ≤ 1024px, mobile ≤ 640px)
- 컴포넌트는 **BEM**, 레이아웃·간격은 **Tailwind utility**
- JS는 최소 인터랙션(모바일 nav·탭·모달·토스트)만 Vanilla로 직접 구현

### 빌드

```bash
cd ui
npm install        # 최초 1회
npm run build      # SCSS → Tailwind 컴파일로 css/main.css 생성
```

> `css/main.css`는 빌드 산출물로 git 제외되며, 소스는 `css/main.scss`만 관리한다.

### 화면 구현 시 규칙

1. 새 화면은 `ui/html/<메뉴>/` 아래에 추가한다.
2. 공통 컴포넌트(toast·modal·field·empty·tabs)는 `docs/ui-publishing/ui-guide.md` 규칙을 따른다.
3. 로고·이미지는 `ui/image/`, 상대경로로 참조한다.

### 참조 문서

- `docs/ui-publishing/screen-specification.md` — 화면 정의
- `docs/ui-publishing/storyboard.md` — 화면 흐름·와이어프레임
- `docs/ui-publishing/ui-guide.md` — 피드백 컴포넌트 규칙
- `docs/ui-publishing/decisions.md` — 기술 결정 기록

## 컨벤션

### 워크스페이스 규칙
- 워크스페이스 디렉토리 안에서만 작업한다.
- `node_modules/` 등 탐색 제외 대상은 검색에서 제외한다.
- 프로젝트 안에서의 경로는 root 기준 절대경로를 사용한다.

### 브랜치 정책
- `main` 브랜치는 **공통/공유 영역**으로 사용한다.
  - 최상위 문서(`README.md`), 공통 스키마·ERD·API 명세 등 stack-independent 자산
  - 여러 스택에서 동시에 참조해야 하는 기준/규칙
- 새로운 스택/기술/시도 단위를 시작할 때마다 **해당 이름으로 브랜치를 생성**한다.
  - 예: `spring-boot-jpa`, `next-prisma`, `express-mysql`
  - 필요 시 단위별로 보조 브랜치(`feat/*`, `fix/*`)를 더 만든다.
- **공통 영역**은 두 가지 방식 중 하나로 둔다.
  - (a) `main` 브랜치에 두어 여러 스택이 공유
  - (b) 모든 스택 브랜치에서 **동일한 디렉토리 구조**(`docs/common/` 등)를 유지
- 시도 종료 후 재사용 가치가 있는 산출물은 `main`으로 머지한다.
  - 머지 방식은 Squash 또는 Rebase를 기본으로 한다.

### Git 컨벤션
- **Conventional Commits** 기반 커밋 메시지를 사용한다.
- 형식: `<type>(<scope>): <subject>`
- **`subject`는 영어**로 작성한다. (명령형·현재형, 첫 글자 소문자 권장)
- **본문(`body`)도 영어**로 작성한다.
- 한국어는 **코드 외 커뮤니케이션**(문서, 주석, PR 설명)에 사용한다.

| type | 용도 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서(주석, README) 변경 |
| `style` | 코드 포맷·세미콜론 등 (동작 변화 없음) |
| `refactor` | 리팩토링 (기능 변화 없음) |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드, 패키지, 설정 등 기타 변경 |
| `perf` | 성능 개선 |
| `ci` | CI/CD 설정 변경 |

예시:
```
feat(board): add pagination to post list
fix(auth): resolve session expiration on login
docs: add learning checklist to README
chore: add eslint and prettier configuration
```

- 커밋은 **기능/단위별로 작게** 쪼개어 작성한다.
- 본 레포지토리는 학습용이므로 작업 중 의미 있는 구간마다 커밋을 남긴다.

### 코드 컨벤션
- 인코딩: **UTF-8**
- 들여쓰기: **공백 4칸** (탭 사용 금지)
- 줄바꿈: **LF**
- 파일 끝에는 **개행 문자 1개** 유지
- 라인 길이: 가독성 위주로 자율 (필요 시 120자 이내 권장)
- 변수/함수/클래스명은 영어, **식별자에 한글·줄임어 남용 금지**
- **주석은 한국어**로 작성한다.
- **문서(README, 설계 문서 등)는 한국어**로 작성한다.
- 환경별/개인 정보(API 키, DB 비밀번호 등)는 **절대 커밋하지 않는다.**

### 공통 구조

스택과 무관하게 **모든 브랜치에서 동일하게 유지되는** 디렉토리 구조다.
스택별 구현은 디렉토리가 아니라 **branch로 구분**하므로, 디렉토리는 "공통 자산"을 담는 용도로만 사용한다.

```text
board-study/
├── .agent/                  # AI 보조원 전용 지시 문서
│   └── AGENT.md             # AI의 역할·권한·작업 절차 (사람용 아님)
├── .private/                # 개인 작업 공간 (커밋·공유 금지, AI 접근 금지)
├── docker/                  # 공통 인프라 (Docker Compose)
│   ├── compose.yml          # PostgreSQL / MongoDB 정의
│   ├── .env                 # 기본 설정 (git 관리)
│   ├── postgres/init/       # PostgreSQL 초기화 스크립트
│   └── mongo/init/          # MongoDB 초기화 스크립트
├── ui/                      # 웹 화면(퍼블리싱) 공통 자산
│   ├── html/                # 화면 마크업 (메뉴 단위)
│   ├── css/                 # SCSS 소스
│   ├── js/                  # 공통 JS
│   ├── image/               # 이미지·로고
│   └── font/                # 웹 폰트
├── docs/                    # 문서 루트
│   └── common/              # 모든 스택이 공유하는 공통 문서
│       ├── requirements.md  # 요구사항 (비즈니스 관점)
│       ├── features.md      # 구현 기능 목록 (체크리스트)
│       └── database.md      # 학습용 DB 구성·연결 정보
└── README.md                # 프로젝트 최상위 안내
```

| 경로 | 역할 |
| --- | --- |
| `README.md` | 프로젝트 목적·컨벤션·공통 구조 안내 |
| `README_<stack-name>.md` | 특정 스택 시도의 개요와 진입점 (root에 위치) |
| `.agent/AGENT.md` | AI 보조원 전용 규칙. 사람이 직접 읽을 필요는 없다 |
| `.private/` | 개인·비공개 작업 공간. 커밋/공유 금지이며 AI도 접근하지 않는다 |
| `docker/` | 학습용 DB 등 공통 인프라 (Docker Compose) |
| `ui/` | 웹 화면(퍼블리싱) 공통 자산 (HTML·SCSS·JS) |
| `docs/common/requirements.md` | 모든 스택이 참조하는 요구사항 |
| `docs/common/features.md` | 모든 스택이 참조하는 구현 기능 목록 |
| `docs/common/database.md` | 학습용 DB 구성·연결 정보·운영 명령 |
| `docs/common/` (그 외) | 공통 ERD·API 명세·스키마 등 |

## 기본 절차

각 스택/기술을 시도할 때마다 다음 4단계를 따른다.

1. **브랜치 생성** — 시도 단위 이름(스택/기술명)으로 브랜치를 만든다.
   ```bash
   git switch -c <stack-name>
   ```
2. **코드 작업** — 해당 스택의 구현을 진행한다.
3. **산출물 작성** — 시도 개요와 결정·배운 점을 문서로 남긴다.
   - `README_<stack-name>.md` (root) — 해당 시도의 개요와 진입점
   - `docs/<stack-name>/decisions.md` — 결정(왜 이 스택/라이브러리를 선택했는가)
   - `docs/<stack-name>/learnings.md` — 배운 점·트러블슈팅·시행착오
   - (필요 시) `docs/<stack-name>/architecture.md`, `docs/<stack-name>/erd.md` 등 추가
4. **종료** — 재사용 가치가 있는 산출물은 `main`으로 머지한다.
