# API 개발 목록

`docs/common/requirements.md` · `features.md` 기반으로 도출한 RESTful API 목록이다.
영역(A~D)과 권한을 함께 표기한다.

## 0. 공통 규칙

- Base URL: `/api/boot-jpa/v1`
- 인증: **JWT Bearer** (`Authorization: Bearer <token>`)
- 권한: `공개`(비회원) / `회원` / `작성자` / `관리자`
- 공통 상태코드
  - 성공: `200 OK` / `201 Created`(생성) / `204 No Content`(삭제)
  - 실패: `400`(잘못된 요청·유효성) / `401`(미인증) / `403`(권한 없음) / `404`(없음)
- 응답·에러 포맷 상세는 4단계(`architecture.md`)에서 확정

## 1. 인증/인가 (B)

| Method | Path | 설명 | 요청 | 응답 | 권한 |
| --- | --- | --- | --- | --- | --- |
| POST | `/auth/signup` | 회원가입 | body: 아이디·비밀번호·닉네임 | Member (`201`) | 공개 |
| POST | `/auth/login` | 로그인 | body: 아이디·비밀번호 | Token{accessToken} (`200`) | 공개 |
| POST | `/auth/logout` | 로그아웃 | - | (`204`) | 회원 |
| POST | `/auth/refresh` | 토큰 재발급 | body: refreshToken | Token (`200`) | 회원 |
| GET | `/members/me` | 내 정보 조회 | - | Member (`200`) | 회원 |

## 2. 관리자 (C)

| Method | Path | 설명 | 요청 | 응답 | 권한 |
| --- | --- | --- | --- | --- | --- |
| GET | `/admin/members` | 회원 목록 | query: page, size, keyword | MemberPage (`200`) | 관리자 |
| GET | `/admin/members/{memberId}` | 회원 상세 | path | Member (`200`) | 관리자 |
| PATCH | `/admin/members/{memberId}/block` | 회원 차단 | path | (`200`) | 관리자 |
| PATCH | `/admin/members/{memberId}/unblock` | 차단 해제 | path | (`200`) | 관리자 |
| DELETE | `/admin/members/{memberId}` | 회원 삭제 | path | (`204`) | 관리자 |

## 3. 게시판 (D)

### 자유게시판

| Method | Path | 설명 | 요청 | 응답 | 권한 |
| --- | --- | --- | --- | --- | --- |
| GET | `/boards/free/posts` | 목록 | query: page, size, sort, category, tags | FreePostPage{items,total} (`200`) | 공개 |
| GET | `/boards/free/posts/{postId}` | 상세(조회수 증가) | path | FreePostDetail (`200`) | 공개 |
| POST | `/boards/free/posts` | 작성 | body: 제목·본문·카테고리·태그 | Post (`201`) | 회원 |
| PATCH | `/boards/free/posts/{postId}` | 수정 | path + body | (`200`) | 작성자 |
| DELETE | `/boards/free/posts/{postId}` | 삭제 | path | (`204`) | 작성자/관리자 |

### 카드게시판

| Method | Path | 설명 | 요청 | 응답 | 권한 |
| --- | --- | --- | --- | --- | --- |
| GET | `/boards/card/posts` | 목록(무한스크롤) | query: cursor, size, sort | CardPostPage{items,nextCursor} (`200`) | 공개 |
| GET | `/boards/card/posts/search` | 검색 | query: keyword, cursor, size | CardPostPage (`200`) | 공개 |
| GET | `/boards/card/posts/{postId}` | 상세(조회수 증가) | path | CardPostDetail (`200`) | 공개 |
| POST | `/boards/card/posts` | 작성 | body: 썸네일(필수)·제목·이미지[] | Post (`201`) | 회원 |
| PATCH | `/boards/card/posts/{postId}` | 수정 | path + body | (`200`) | 작성자 |
| DELETE | `/boards/card/posts/{postId}` | 삭제 | path | (`204`) | 작성자/관리자 |

### 홈 (인기글)

| Method | Path | 설명 | 요청 | 응답 | 권한 |
| --- | --- | --- | --- | --- | --- |
| GET | `/home/free/popular` | 자유게시판 인기글 5 | - | PopularPost[] (`200`) | 공개 |

> 홈 화면 = `GET /home/free/popular` + `GET /boards/card/posts`(첫 페이지) 조합으로 구성한다.

### 댓글 (공통)

| Method | Path | 설명 | 요청 | 응답 | 권한 |
| --- | --- | --- | --- | --- | --- |
| GET | `/posts/{postId}/comments` | 댓글·대댓글 목록 | path | Comment[] (`200`) | 공개 |
| POST | `/posts/{postId}/comments` | 댓글·대댓글 작성 | path + body(parentId) | Comment (`201`) | 회원 |
| PATCH | `/comments/{commentId}` | 댓글 수정 | path + body | (`200`) | 작성자 |
| DELETE | `/comments/{commentId}` | 댓글 삭제 | path | (`204`) | 작성자/관리자 |

### 파일

| Method | Path | 설명 | 요청 | 응답 | 권한 |
| --- | --- | --- | --- | --- | --- |
| POST | `/files` | 이미지 업로드 | multipart | FileInfo{url} (`201`) | 회원 |

## 4. 파라미터 규칙

### Offset 페이징 (자유게시판·회원 목록)

| 파라미터 | 의미 | 기본값 |
| --- | --- | --- |
| `page` | 페이지 번호(1부터) | 1 |
| `size` | 한 페이지 개수 | 20 |

### Cursor 페이징 (카드게시판)

| 파라미터 | 의미 | 기본값 |
| --- | --- | --- |
| `cursor` | 이전 응답의 `nextCursor`(첫 요청 시 생략) | - |
| `size` | 한 번에 가져올 개수 | 12 |

### 정렬·필터·검색

| 파라미터 | 대상 | 값 |
| --- | --- | --- |
| `sort` | 자유/카드 목록 | `latest` / `view` / `recommend` |
| `category` | 자유 목록 | 카테고리 코드 |
| `tags` | 자유 목록 | 쉼표 구분(예: `java,web`) |
| `keyword` | 카드 검색·회원 검색 | 검색어 |

## 5. 분리 기준 (확정)

- API는 **리소스(데이터) 단위**로 구분하고, 권한은 리소스의 속성으로 부여한다.
- 화면(홈·목록)은 별도 영역이 아니라 **여러 API를 조합**하는 클라이언트 역할이다.
- 게시판(board)은 게시물 CRUD와 목록·검색·댓글·파일을 하나의 영역으로 묶는다.
