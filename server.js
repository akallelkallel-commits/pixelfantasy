// Pixel Box: servidor do multiplayer. Serve o jogo e repassa as mensagens entre os jogadores da mesma sala.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };

const srv = http.createServer((req, res) => {
  let f = decodeURIComponent((req.url || '/').split('?')[0]);
  if (f === '/' || f === '') f = '/index.html';
  const p = path.normalize(path.join(PUB, f));
  if (!p.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => {
    if (e) { res.writeHead(404); return res.end('Arquivo não encontrado'); }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(d);
  });
});

const wss = new WebSocketServer({ server: srv, path: '/ws', maxPayload: 64 * 1024 * 1024 });
const salas = new Map();
let proximo = 0;
const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function novoCodigo() { let c; do { c = ''; for (let i = 0; i < 4; i++) c += LETRAS[Math.floor(Math.random() * LETRAS.length)]; } while (salas.has(c)); return c; }
function manda(ws, m) { if (ws.readyState === 1) ws.send(JSON.stringify(m)); }

wss.on('connection', ws => {
  ws.id = ++proximo;
  ws.on('message', buf => {
    let m; try { m = JSON.parse(buf); } catch (e) { return; }
    if (m.t === 'host') {
      const c = novoCodigo();
      salas.set(c, { host: ws, todos: new Set([ws]) });
      ws.sala = c; ws.nome = m.name;
      manda(ws, { t: 'room', code: c, id: ws.id });
      console.log('Sala ' + c + ' aberta por ' + (m.name || '?'));
      return;
    }
    if (m.t === 'join') {
      const s = salas.get(String(m.code || '').toUpperCase());
      if (!s) return manda(ws, { t: 'err', msg: 'Não achei essa sala. Confira o código.' });
      if (s.todos.size >= 8) return manda(ws, { t: 'err', msg: 'A sala está cheia.' });
      ws.sala = String(m.code).toUpperCase(); ws.nome = m.name;
      s.todos.add(ws);
      manda(ws, { t: 'joined', id: ws.id, host: s.host.id });
      manda(s.host, { t: 'join', id: ws.id, name: m.name, skin: m.skin });
      return;
    }
    const s = salas.get(ws.sala); if (!s) return;
    m.from = ws.id;
    const txt = JSON.stringify(m);
    if (m.to) { for (const o of s.todos) if (o.id === m.to && o.readyState === 1) o.send(txt); return; }
    for (const o of s.todos) if (o !== ws && o.readyState === 1) o.send(txt);
  });
  ws.on('close', () => {
    const s = salas.get(ws.sala); if (!s) return;
    s.todos.delete(ws);
    if (s.host === ws) { for (const o of s.todos) manda(o, { t: 'hostleft' }); salas.delete(ws.sala); console.log('Sala ' + ws.sala + ' fechada'); }
    else for (const o of s.todos) manda(o, { t: 'left', id: ws.id });
  });
});

srv.listen(PORT, () => console.log('Pixel Box rodando em http://localhost:' + PORT));
