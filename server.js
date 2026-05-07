const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const HOST = '0.0.0.0'; // 모든 인터페이스

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  💰 현금 출납부 서버 실행 중');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('  📱 같은 WiFi의 폰에서 접속:');
  console.log(`     http://192.168.1.62:${PORT}`);
  console.log('');
  console.log('  💻 PC에서 열기:');
  console.log(`     http://localhost:${PORT}`);
  console.log('');
  console.log('  Ctrl+C 로 종료');
  console.log('═══════════════════════════════════════════');
});