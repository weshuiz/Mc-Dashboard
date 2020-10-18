const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let ready = false;

const { spawn } = require('child_process');// import 'spawn' function from 'child_process' Dependency
server = spawn('java', ['-Xmx2048M', '-Xms1024M', '-jar', 'spigot.jar', 'pause'], {cwd: 'minecraft'} );// start server in the 'minecraft' directory

server.stdout.on('data', (buffer) => {
  const data = buffer.toString();
  io.emit('server Log', data);
  //console.log(data);

  if(data.includes("Done")) {// server ready for input
    ready = true;
  }
});

// server error output
server.stderr.on('data', (buffer) => {
  const data = buffer-toString();
  socket.emit('server Log', data);
});

// server exit output
server.on('close', (code) => {
  const data = buffer-toString();
  socket.emit('server Log', code);
});

io.on('connection', (socket) => {
  //console.log('user connected');

  socket.on('disconnect', () => {
    //console.log('user disconnected');
  });
});

app.get('/', (req, res) => {// load index.html on root directory
  res.sendFile(__dirname + '/test.html');
});

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const text = bodyParser.text();
const raw = bodyParser.raw();
app.post('/commands', jsonParser, function (req, res) {
  const command = req.body[0].value;
  server.stdin.write(command+'\n');
  res.json({ success: true });
});

http.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});