
const socketio = require('socket.io-client');
const { execSync } = require('child_process');

const NBR_POSSIBILITES_TO_ECHO = 1000000; //NOTE: Change this to adapt the cmd script to perform his task in at least 60 sec

function connectSocket() {
  return new Promise((resolve, reject) => {
    let socket = socketio('http://localhost:3001');
    socket.on('connect', () => {
      console.log(`===== connected ${socket.id}`);

      socket.once('hello', (a, b, c) => {
        console.log('I RECEIVE AN HELLO MESSAGE ! YOUHOU !')
        console.log(a, b, c);
        socket.close();
      });
      resolve(socket);
    });
    socket.on('disconnect', () => {
      console.log(` ==/==disconnect ${socket.id}`);
    });
  });
}

(async () => {
  let socket = await connectSocket();
  console.log(`Socket is actually: ${socket.connected ? 'Connected' : 'Disconnected'}`);
  console.log(`Echo ${NBR_POSSIBILITES_TO_ECHO} possibilities and send an hello msg...`)
  console.log('Doing some SyncTask that take a while, this will kill the socket connection, (you should manage to make the sync task perform at least 60 sec in a row)');
  console.time('timer');
  execSync(`for /L %i in (1, 1, ${NBR_POSSIBILITES_TO_ECHO}) do echo %i`, { stdio: 'ignore', stderr: 'ignore' });
  console.timeEnd('timer');
  console.log('Send a hello message...');
  console.log(`Socket is actually: ${socket.connected ? 'Connected' : 'Disconnected'}`);

  //The unworking part
  //-------HERE
  if (socket.connected) {
    console.log('-emit hello msg');
    socket.emit('hello');
  }
  else {
    console.log('the socket is actually disconnected :/');
    socket.close();
  }
  //-------TOHERE
})();
