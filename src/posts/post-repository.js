import { pool } from '../db/pool.js';

export async function countFreePosts() {
    const result = await pool.query(
        `SELECT COUNT(*)::int AS count
         FROM "POSTS" AS p
         JOIN "BOARDS" AS b ON b."ID" = p."BOARD_ID"
         WHERE b."BOARD_TYPE" = 'free'`,
    );

    return result.rows[0].count;
}

export async function findFreePosts({ limit, offset }) {
    const result = await pool.query(
        `SELECT
            p."ID" AS id,
            p."TITLE" AS title,
            u."DISPLAY_NAME" AS author,
            p."VIEW_COUNT" AS view_count,
            p."CREATE_DATE" AS create_date
         FROM "POSTS" AS p
         JOIN "BOARDS" AS b ON b."ID" = p."BOARD_ID"
         JOIN "USERS" AS u ON u."ID" = p."AUTHOR_ID"
         WHERE b."BOARD_TYPE" = 'free'
         ORDER BY p."CREATE_DATE" DESC, p."ID" DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset],
    );

    return result.rows;
}

export async function findFreePostById(postId) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const updateResult = await client.query(
            `UPDATE "POSTS" AS p
             SET "VIEW_COUNT" = p."VIEW_COUNT" + 1,
                 "UPDATE_DATE" = p."UPDATE_DATE"
             FROM "BOARDS" AS b
             WHERE p."ID" = $1
               AND p."BOARD_ID" = b."ID"
               AND b."BOARD_TYPE" = 'free'
             RETURNING p."ID"`,
            [postId],
        );

        if (updateResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const result = await client.query(
            `SELECT
                p."ID" AS id,
                p."TITLE" AS title,
                p."CONTENT" AS content,
                u."DISPLAY_NAME" AS author,
                p."VIEW_COUNT" AS view_count,
                p."CREATE_DATE" AS create_date,
                p."UPDATE_DATE" AS update_date
             FROM "POSTS" AS p
             JOIN "BOARDS" AS b ON b."ID" = p."BOARD_ID"
             JOIN "USERS" AS u ON u."ID" = p."AUTHOR_ID"
             WHERE b."BOARD_TYPE" = 'free'
               AND p."ID" = $1`,
            [postId],
        );

        await client.query('COMMIT');
        return result.rows[0] ?? null;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}
