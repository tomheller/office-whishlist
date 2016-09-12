const io = require('socket.io');
const mp = require('../mopidyconnector');


module.exports = (server) => {
  const socketServer = io(server);
  const connections = [];
  socketServer.set('origins', 'http://localhost:3001');

  mp.bindListener('event:tracklistChanged', () => {
    mp.tracklist()
      .then(list => {
        connections.forEach(connectedSocket => {
          connectedSocket.emit('updatetracklist', list);
        });
      });
  });

  socketServer.on('connection', socket => {
    connections.push(socket);

    try {
      //send initial tracklist
      mp.tracklist()
        .then(list => socket.emit('updatetracklist', list))

      //send initial playstate
      mp.getPlaystate()
        .then(state => socket.emit('updateplaystate', state));
    } catch(e){};

    socket.on('search', data => {
      mp.searchTrack(data)
        .then(result => {
          socket.emit('searchresults', result)
        });
    });

    socket.on('addtrack', track => mp.addTrack(track));

    socket.on('votetrack', trackuri => mp.voteTrack(trackuri, socket.handshake.address));

    socket.on('setvolume', volume => {
      mp.setVolume(volume)
        .then(_ => mp.getPlaystate())
        .then(playstate => {
          connections.forEach(connectedSocket => {
            connectedSocket.emit('updateplaystate', playstate);
          });
        });
    });

    socket.on('toggleplaypause', () => {
      console.log('toggle play pause inc');
      mp.togglePlaystate()
        .then(_ => mp.getPlaystate())
        .then(playstate => {
          connections.forEach(connectedSocket => {
            connectedSocket.emit('updateplaystate', playstate);
          });
        });
    });

    socket.on('getplaystate', () => {
      mp.getPlaystate()
        .then(state => socket.emit('updateplaystate', state));
    });

    socket.on('disconnect', () => {
      const index = connections.indexOf(socket);
      connections.splice(index, 1);
    });
  });
}
