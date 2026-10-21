import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
export function serve(port = 5173) {
  const srv = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x');
      const rel = normalize(url.pathname === '/' ? '/index.html' : url.pathname);
      if (rel.includes('..')) throw new Error('bad path');
      const data = await readFile(join(process.cwd(), rel));
      res.writeHead(200, { 'Content-Type': types[extname(rel)] || 'application/octet-stream' });
      res.end(data);
    } catch { res.writeHead(404); res.end('not found'); }
  });
  return new Promise((r) => srv.listen(port, () => r(srv)));
}
if (import.meta.url === 'file://' + process.argv[1]) { await serve(); console.log('http://localhost:5173'); }
