# 데이터베이스 구성

학습용으로 사용할 데이터베이스를 **Docker Compose**로 구성한다.
프레임워크 실습 시 데이터 준비에 시간을 쓰지 않도록, DB를 미리 띄워 두고 연결 정보를 제공한다.

## 개요

| DB | 이미지 | 컨테이너 | 포트 | 비고 |
| --- | --- | --- | --- | --- |
| PostgreSQL | `postgres:16-alpine` | `board-study-postgres` | `5432` | 관계형, SQL 실습 |
| MongoDB | `mongo:7` | `board-study-mongo` | `27017` | 문서형, NoSQL 실습 |

- 데이터 영속화: named volume (`postgres_data`, `mongo_data`)
- 재시작: `restart: unless-stopped`
- healthcheck: 두 컨테이너 모두 활성화

## 빠른 시작

```bash
# 구성 파일 위치로 이동
cd docker

# 기동 (백그라운드)
docker compose up -d

# 상태 확인
docker compose ps
```

> 최초 기동 시 이미지 pull 및 볼륨 생성, init 스크립트 실행이 진행된다.

## 연결 정보

### PostgreSQL

| 항목 | 값 |
| --- | --- |
| Host / Port | `localhost:5432` |
| Database | `board` |
| 관리자 계정 | `admin` / `admin1234` |
| 앱 전용 계정 | `board_app` / `app1234` |

접속 예시:

```bash
# psql (컨테이너 내부)
docker exec -it board-study-postgres psql -U admin -d board

# 앱 전용 계정
docker exec -it board-study-postgres psql -U board_app -d board
```

연결 URL:

```
# 관리자
postgresql://admin:admin1234@localhost:5432/board

# 앱 전용 (실습 권장)
postgresql://board_app:app1234@localhost:5432/board
```

JDBC(Java) URL:

```
jdbc:postgresql://localhost:5432/board
```

### MongoDB

| 항목 | 값 |
| --- | --- |
| Host / Port | `localhost:27017` |
| Database | `board` |
| root 계정 | `admin` / `admin1234` (authSource: `admin`) |
| 앱 전용 계정 | `board_app` / `app1234` (authSource: `board`) |

접속 예시:

```bash
# mongosh (컨테이너 내부)
docker exec -it board-study-mongo mongosh -u admin -p admin1234 --authenticationDatabase admin
```

연결 URI:

```
# root
mongodb://admin:admin1234@localhost:27017/admin

# 앱 전용 (실습 권장)
mongodb://board_app:app1234@localhost:27017/board?authSource=board
```

## 초기화(init) 스크립트

최초 볼륨 생성 시 한 번만 실행된다. 이미 볼륨이 있다면 반영되지 않으므로,
변경 후에는 `docker compose down -v`로 볼륨까지 삭제하고 다시 올려야 한다.

```
docker/postgres/init/01-init.sql   # board_app 앱 계정 생성
docker/mongo/init/01-init.js       # board_app 앱 계정 생성
```

## 운영 명령

```bash
cd docker

# 중지 (데이터 유지)
docker compose stop

# 재기동
docker compose start

# 삭제 (컨테이너·네트워크 제거, 볼륨 유지)
docker compose down

# 완전 초기화 (볼륨까지 삭제 → init 재실행)
docker compose down -v && docker compose up -d

# 로그
docker compose logs -f postgres
docker compose logs -f mongo
```

## 설정 변경 (포트·비밀번호)

기본 설정은 `docker/.env`에 두고 **git으로 관리**한다.
환경별/로컬 커스텀은 `.env.local`, `.env.production` 등 `.env.*` 파일에 두며,
이 파일들은 `.gitignore`의 `.env.*` 패턴으로 git에서 제외된다.

```bash
cd docker
# .env 수정 → 반영
docker compose up -d
```

- `docker/.env` — 기본 설정 (git 관리 대상)
- `.env.local`, `.env.production` 등 — 로컬/환경별 커스텀 (git 제외)

## 주의

- 호스트 포트 `5432`, `27017`가 이미 사용 중이면 `docker/.env`에서 포트를 변경한다.
- 기존에 다른 프로젝트의 PostgreSQL(`test-board-db`, 호스트 8000)과는 무관한 별도 구성이다.
