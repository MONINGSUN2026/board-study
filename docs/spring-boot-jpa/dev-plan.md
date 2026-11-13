# spring-boot-jpa — 서비스 개발 계획 (Dev Plan)

게시판 서비스 RESTful API 개발을 위한 설계·계획 문서다.

## 1. 목표

- Spring Boot + JPA 기반 게시판 서비스 RESTful API 구현.
- 빌드 후 Docker 배포 및 동작 확인.

## 2. 개발 단계

| 단계 | 내용 | 산출물 |
| --- | --- | --- |
| 1 | 요구사항·기능 범위 확정 | `docs/common/requirements.md`, `features.md` |
| 2 | API 개발 목록 작성 | `api-list.md` |
| 3 | 개발 환경·기술 결정 | `decisions.md` |
| 4 | 서비스 기술 설계 | `architecture.md` |
| 5 | 영역별 구현 | 소스 코드 |
| 6 | 빌드·Docker 배포·검증 | 실행 확인 |

## 3. 서비스 기술 설계 항목

1. **도메인 모델링** — 엔티티 식별, 연관관계, ERD
2. **API 명세** — 엔드포인트, 요청/응답 DTO, 상태코드, 에러 포맷
3. **패키지·계층 구조** — controller / service / repository
4. **보안 설계** — 인증 방식, 권한 범위(비회원/회원/관리자)
5. **예외 처리** — 전역 핸들러, 비즈니스 예외 정의
6. **유효성 검증** — Bean Validation
7. **페이지네이션** — 자유게시판(Offset), 카드게시판(Cursor)
8. **테스트 전략** — 단위 / 통합

## 4. 영역(모듈) 구분 및 구현 순서

| 순서 | 영역 | 담당 기능 |
| --- | --- | --- |
| A | 공통(common) | 응답 포맷, 전역 예외, BaseEntity, 설정 |
| B | 인증/인가(auth) | 회원가입·로그인, JWT, 권한 |
| C | 관리자 회원관리(admin) | 회원 목록·차단·삭제 |
| D | 게시판·게시물 관리(board) | 자유/카드 게시판·게시물·댓글·파일 CRUD |
| E | 사용자 게시판(user) | 홈, 목록, 카드 검색(무한스크롤) |

의존 순서: A → B,C → D → E

## 5. 영역별 완료 기준 (Definition of Done)

- 해당 영역 API 구현, 컴파일·테스트 통과
- 영역별 결정 사항을 `decisions.md`에 기록
- 영역 단위로 커밋

## 6. 배포

- Dockerfile 작성, `docker compose`로 API + PostgreSQL 기동
- 헬스체크·주요 API 호출로 정상 동작 확인
