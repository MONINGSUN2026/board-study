import { createServer } from 'node:http';

import { closePool } from './db/pool.js';
import {
    countFreePosts,
    findFreePostById,
    findFreePosts,
} from './posts/post-repository.js';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

function sendJson(response, statusCode, payload) {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(payload));
}

function parsePagination(searchParams) {
    const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
    const size = Number.parseInt(searchParams.get('size') ?? '10', 10);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1 || size > 50) {
        return null;
    }

    return {
        page,
        size,
        offset: (page - 1) * size,
    };
}

async function handleRequest(request, response) {
    const requestUrl = new URL(
        request.url ?? '/',
        `http://${request.headers.host ?? `${host}:${port}`}`,
    );

    if (request.method === 'GET' && requestUrl.pathname === '/') {
        sendJson(response, 200, {
            name: 'board-study-nodejs',
            message: 'Node.js 학습 서버가 실행 중입니다.',
        });
        return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/health') {
        sendJson(response, 200, {
            status: 'ok',
        });
        return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/boards/free/posts') {
        const pagination = parsePagination(requestUrl.searchParams);

        if (!pagination) {
            sendJson(response, 400, {
                error: 'INVALID_PAGINATION',
                message: 'page는 1 이상, size는 1부터 50까지의 정수여야 합니다.',
            });
            return;
        }

        const [posts, totalItems] = await Promise.all([
            findFreePosts({
                limit: pagination.size,
                offset: pagination.offset,
            }),
            countFreePosts(),
        ]);

        sendJson(response, 200, {
            data: posts,
            pagination: {
                page: pagination.page,
                size: pagination.size,
                totalItems,
                totalPages: Math.ceil(totalItems / pagination.size),
            },
        });
        return;
    }

    const detailMatch = requestUrl.pathname.match(/^\/api\/boards\/free\/posts\/(\d+)$/);

    if (request.method === 'GET' && detailMatch) {
        const post = await findFreePostById(Number.parseInt(detailMatch[1], 10));

        if (!post) {
            sendJson(response, 404, {
                error: 'NOT_FOUND',
                message: '게시글을 찾을 수 없습니다.',
            });
            return;
        }

        sendJson(response, 200, {
            data: post,
        });
        return;
    }

    sendJson(response, 404, {
        error: 'NOT_FOUND',
        message: '요청한 경로를 찾을 수 없습니다.',
    });
}

const server = createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
        console.error('Request failed.', error);
        sendJson(response, 500, {
            error: 'INTERNAL_SERVER_ERROR',
            message: '서버 오류가 발생했습니다.',
        });
    });
});

server.listen(port, host, () => {
    console.log(`Node.js server listening on http://${host}:${port}`);
});

let isShuttingDown = false;

async function shutdown(signal) {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.log(`${signal} received. Shutting down server.`);

    server.close(async () => {
        await closePool();
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
