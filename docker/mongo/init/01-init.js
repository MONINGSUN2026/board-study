// 실습용 앱 전용 사용자 생성.
// board 데이터베이스에 readWrite 권한을 부여한다.
db.createUser({
    user: 'board_app',
    pwd: 'app1234',
    roles: [
        { role: 'readWrite', db: 'board' }
    ]
});
