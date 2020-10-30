
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/public'));

io.on('connect', socket => {
  console.log(`connect ${socket.id}`);

  socket.on('hello', () => {
    socket.emit('hello', {
      hello: 'you'
    });
  });

  socket.on('disconnect', () => {
    console.log(`disconnect ${socket.id}`);
  });
});

server.listen(port, () => console.log(`server listening on port ${port}`));
