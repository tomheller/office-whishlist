'use strict';

const Mopidy = require('mopidy');
const low = require('lowdb');
const db = low('db.json');
db.defaults({ votingdata: []}) .value();

let online = false;

const mp = new Mopidy({
  webSocketUrl: 'ws://192.168.0.14:6680/mopidy/ws/'
});


mp.on('state:online', () => {
  console.log('connected');
  online = true;

  // init mplist
  mp.tracklist.getTracks()
    .then((list) => {
      list.forEach((tr) => {
        const match = db.get('votingdata')
          .find({uri: tr.uri})
          .value();

        if(!match) {
          db.get('votingdata')
            .push({
              uri: tr.uri,
              dateAdded: Date.now(),
              votingdata: {
                up: [],
                down: [],
              }
            }).value();
        }
      });
    });
  mp.tracklist.setConsume(true);
});

mp.on('state:offline', () => {
  console.log('connection dropped');
  online = false;
});

mp.on('event:trackPlaybackEnded', (e) => {
  console.log('playback ended', e);
  const track = e.tl_track.track;
  db.get('votingdata')
    .remove({uri: track.uri})
    .value();
});

const applyVoting = (tracklist) => {
  const votedList = tracklist.map((track) => {
    const uri = track.uri;
    const match = db.get('votingdata')
      .find({uri: uri})
      .value();
    if(match) {
      track.votingdata = match.votingdata;
      track.dateAdded = match.dateAdded;
    }
    return track;
  });
  return votedList;
};

const bindListener = (evt, callback) => {
  mp.on(evt, callback);
};

const search = (query) => {
  if(online && query) {
    return mp.library.search({
      any: [query]
    });
  }
};

const addtrack = (track) => {
  if(online && track) {
    return getTracklist()
      .then(list => {
        let addable = true;
        let insertPosition = list.length;
        list.forEach((t, index) => {
          if(t.uri === track.uri) {
            addable = false;
          }
          if((t.votingdata.up.length - t.votingdata.down.length) < 0 && insertPosition === list.length) {
            insertPosition = index;
          }
        });
        if(addable) {
          db.get('votingdata')
            .push({
              uri: track.uri,
              dateAdded: Date.now(),
              votingdata: {
                up: [],
                down: [],
              }
            }).value();
          // votinglist.push();
          delete track.dateAdded;
          delete track.votingdata;
          return mp.tracklist.add([track], insertPosition);
        }
      })
      .then(list => mp.tracklist.getTracks())
      .then(list => applyVoting(list));
  }
};

const voteTrack = (data, voterid) => {
  if(online) {
    const uri = data.uri;
    const match = db.get('votingdata')
      .find({uri: uri})
      .value();
    const isAllowedToVote = match.votingdata.up.concat(match.votingdata.down).indexOf(voterid) === -1;
    if(isAllowedToVote){
      if (data.upvote) {
        match.votingdata.up.push(voterid);
      } else {
        match.votingdata.down.push(voterid);
      }

      let list = [];
      let state;
      return getTracklist()
        .then(l => {
          return getPlaystate()
            .then(ps => {
              state = ps;
              return l;
            });
        })
        .then(l => {
          l.forEach((tr) => {
            tr.votingdata.sum = tr.votingdata.up.length - tr.votingdata.down.length
          });
          return l;
        })
        .then(l => {
          list = l;
          return list.find((tr) => tr.uri === uri);
        })
        .then(match => {
          const index = list.indexOf(match);
          let start = 0;
          if (state.playstate === 'playing' || state.time > 0) {
            start = 1;
          }
          let newPosition = index;
          if(index!== 0 && data.upvote) {
            for (let i = index-1; i >= start; i--) {
              if (match.votingdata.sum > list[i].votingdata.sum) {
                newPosition = i;
                continue;
              }
              if (match.votingdata.sum === list[i].votingdata.sum && match.dateAdded < list[i].dateAdded) {
                newPosition = i;
              }
            }
          } else if(index !== list.length && !data.upvote) {
            for (let i = index+1; i < list.length; i++) {
              if (match.votingdata.sum < list[i].votingdata.sum) {
                newPosition = i;
                continue;
              }
              if (match.votingdata.sum === list[i].votingdata.sum && match.dateAdded < list[i].dateAdded) {
                newPosition = i;
              }
            }
          }
          return mp.tracklist.move(index, index, newPosition)
            .then(d => getTracklist());
        });
    }
  }
};

const getTracklist = () => {
  if(online) {
    return mp.tracklist.getTracks()
     .then(list => applyVoting(list));
  }
};

const togglePlaystate = () => {
  if(online) {
    return mp.playback.getState()
      .then(state => {
        switch (state){
          case 'stopped':
          case 'paused':
            return mp.playback.play();
            break;
          case 'playing':
            return mp.playback.pause();
            break;
          default:
            break;
        }
      });
  }
};

const getPlaystate = () => {
  if(online) {
    return Promise.all([
      mp.playback.getCurrentTrack(),
      mp.playback.getState(),
      mp.playback.getVolume(),
      mp.playback.getTimePosition(),
    ]).then(d => {
      return {
        track: d[0],
        playstate: d[1],
        volume: d[2],
        time: d[3],
      };
    });
  }
};

const setvolume = (volume) => {
  return mp.mixer.setVolume(parseInt(volume));
};

const clearTracklist = () => {
  if(online) {
    mp.tracklist.clear();
  }
};

module.exports = {
  instance: mp,
  status: online,
  searchTrack: search,
  addTrack: addtrack,
  tracklist: getTracklist,
  togglePlaystate: togglePlaystate,
  getPlaystate: getPlaystate,
  voteTrack: voteTrack,
  bindListener: bindListener,
  setVolume: setvolume,
};
