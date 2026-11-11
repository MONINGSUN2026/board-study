-- 실습용 앱 전용 계정 생성.
-- 관리자(POSTGRES_USER) 대신 애플리케이션은 이 계정을 사용하는 것을 권장한다.
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'board_app') THEN
        CREATE ROLE board_app LOGIN PASSWORD 'app1234';
    END IF;
END
$$;

-- 공개 스키마 권한 부여 (board_app이 테이블 생성/조작 가능)
GRANT ALL PRIVILEGES ON SCHEMA public TO board_app;
GRANT ALL PRIVILEGES ON DATABASE board TO board_app;
