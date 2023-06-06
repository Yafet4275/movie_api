const http = require('http'),
  fs = require('fs'),
  url = require('url');
  
fs.writeFile('log.txt', '', (err) => {
  if (err) {
    console.error('Error creating log.txt file:', err);
  } else {
    console.log('log.txt file created.');
  }
});

http.createServer((request, response) => {
  let addr = request.url;
  let q = url.parse(addr, true);
  let filePath = '';

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log('Error logging request:', err);
    } else {
      console.log('Request logged in log.txt.');
    }
  });

  if (q.pathname.includes('documentation')) {
    filePath = __dirname + '/documentation.html';
  } else {
    filePath = __dirname + '/index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });
}).listen(8080);

console.log('Server is running on Port 8080.');
