INSERT INTO "USERS" ("DISPLAY_NAME")
SELECT '학습 사용자'
WHERE NOT EXISTS (
    SELECT 1
    FROM "USERS"
    WHERE "DISPLAY_NAME" = '학습 사용자'
);

INSERT INTO "BOARDS" ("BOARD_TYPE", "NAME")
SELECT 'free', '자유게시판'
WHERE NOT EXISTS (
    SELECT 1
    FROM "BOARDS"
    WHERE "BOARD_TYPE" = 'free'
);

INSERT INTO "BOARDS" ("BOARD_TYPE", "NAME")
SELECT 'card', '카드게시판'
WHERE NOT EXISTS (
    SELECT 1
    FROM "BOARDS"
    WHERE "BOARD_TYPE" = 'card'
);

INSERT INTO "POSTS" ("BOARD_ID", "AUTHOR_ID", "TITLE", "CONTENT")
SELECT
    b."ID",
    u."ID",
    'Node.js 게시판 학습 시작',
    '첫 번째 자유게시판 게시글입니다.'
FROM "BOARDS" AS b
JOIN "USERS" AS u ON u."DISPLAY_NAME" = '학습 사용자'
WHERE b."BOARD_TYPE" = 'free'
  AND NOT EXISTS (
      SELECT 1
      FROM "POSTS"
      WHERE "TITLE" = 'Node.js 게시판 학습 시작'
  );

INSERT INTO "POSTS" ("BOARD_ID", "AUTHOR_ID", "TITLE", "CONTENT")
SELECT
    b."ID",
    u."ID",
    'HTTP 요청과 응답 이해하기',
    'Node.js 기본 HTTP 서버의 흐름을 확인합니다.'
FROM "BOARDS" AS b
JOIN "USERS" AS u ON u."DISPLAY_NAME" = '학습 사용자'
WHERE b."BOARD_TYPE" = 'free'
  AND NOT EXISTS (
      SELECT 1
      FROM "POSTS"
      WHERE "TITLE" = 'HTTP 요청과 응답 이해하기'
  );

INSERT INTO "POSTS" ("BOARD_ID", "AUTHOR_ID", "TITLE", "CONTENT")
SELECT
    b."ID",
    u."ID",
    'PostgreSQL 조회 실습',
    '요구사항 기반의 첫 수직 기능을 구현합니다.'
FROM "BOARDS" AS b
JOIN "USERS" AS u ON u."DISPLAY_NAME" = '학습 사용자'
WHERE b."BOARD_TYPE" = 'free'
  AND NOT EXISTS (
      SELECT 1
      FROM "POSTS"
      WHERE "TITLE" = 'PostgreSQL 조회 실습'
  );
