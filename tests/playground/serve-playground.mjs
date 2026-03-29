import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(new URL('../../package.json', import.meta.url)));
const distDir = path.join(rootDir, 'apps/playground/dist');
const host = '127.0.0.1';
const port = 6200;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function sendFile(response, filePath) {
  const extension = path.extname(filePath);
  response.writeHead(200, {
    'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(filePath).pipe(response);
}

function resolveDistFile(requestPath) {
  if (requestPath.startsWith('/playground/assets/')) {
    return path.join(distDir, requestPath.replace('/playground/', ''));
  }

  if (
    requestPath === '/playground' ||
    requestPath === '/playground/' ||
    requestPath.startsWith('/playground/')
  ) {
    return path.join(distDir, 'index.html');
  }

  return null;
}

const server = createServer(async (request, response) => {
  const requestPath = request.url ? new URL(request.url, `http://${host}:${port}`).pathname : '/';

  if (requestPath === '/favicon.ico') {
    response.writeHead(204);
    response.end();
    return;
  }

  const filePath = resolveDistFile(requestPath);
  if (!filePath) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  if (!existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  const fileStat = await stat(filePath);
  if (fileStat.isDirectory()) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  sendFile(response, filePath);
});

server.listen(port, host, () => {
  process.stdout.write(`Playground test server listening at http://${host}:${port}\n`);
});
