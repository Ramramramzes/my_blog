import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { BASE_URL } from '../src/common/common.js';
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const port = process.env.PROXY_PORT;
const authPort = process.env.AUTH_PORT
const wsPort = process.env.WS_PORT

app.use('/auth', createProxyMiddleware({
    target: `${BASE_URL}:${authPort}`,
    changeOrigin: true,
}));

app.use('/ws', createProxyMiddleware({
    target: `${BASE_URL}:${wsPort}`,
    changeOrigin: true,
    ws: true,
}));

app.listen(port, () => {
    console.log(`Прокси-сервер запущен на порту PROXY_PORT`);
});