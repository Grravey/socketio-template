const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');

const HTTP_PORT = 3000;

function middleware(req, res, next) {
  req.middleware = 'hello';
  next();
}

app.get('/middlewareExample', middleware, (req, res) => {
  res.send(req.middleware);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/chat-client.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/chatClient.js'));
});

app.get('/jquery.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/lib/jquery.js'));
});

io.on('connection', (socket) => {
  let connectionId = Math.floor(Math.random()*100);
  console.log(`there is a connection! (id: ${connectionId})`);
  
  io.emit('server message', `id ${connectionId} has just joined`);
  socket.emit('server message', `Hello, you are ${connectionId}`);
  
  socket.on('disconnect', () => {
    console.log(`user disconnected (id: ${connectionId})`);
    io.emit('server message', `user disconnected (id: ${connectionId})`);
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', connectionId + ': ' + msg);
  });
});

server.listen(HTTP_PORT, () => {
  console.log('listening on port: ', HTTP_PORT);
});