import * as actions from '../actions/control-actions';
import io from 'socket.io-client';

var socket = null;

export function owlMiddleware(store) {
  return next => action => {
    if (socket && action.type === actions.ADD_SEARCH_TERM) {
      socket.emit('search', action.query);
    }
    if (socket && action.type === actions.ADD_TRACK) {
      socket.emit('addtrack', action.track);
    }
    if (socket && action.type === actions.CTRL_PLAYPAUSE) {
      socket.emit('toggleplaypause');
    }
    if (socket && action.type === actions.GET_PLAYSTATE) {
      socket.emit('getplaystate');
    }
    if (socket && action.type === actions.CTRL_VOLUME) {
      socket.emit('setvolume', action.value);
    }
    if (socket && (action.type === actions.VOTE_TRACK_DOWN || action.type === actions.VOTE_TRACK_UP)) {
      switch(action.type) {
        case actions.VOTE_TRACK_DOWN:
          socket.emit('votetrack', {uri: action.track.uri, upvote: false});
          break;
        case actions.VOTE_TRACK_UP:
          socket.emit('votetrack', {uri: action.track.uri, upvote: true});
          break;
      }
    }
    return next(action);
  };
}

export default function (store) {
  socket = io.connect(`${location.protocol}//${location.host}/`);

  socket.on('searchresults', results => {
    store.dispatch(actions.setSearchResults(results));
  });

  socket.on('updatetracklist', tracklist => {
    store.dispatch(actions.setTracklist(tracklist));
  });

  socket.on('updateplaystate', playstate => {
    store.dispatch(actions.setPlaystate(playstate));
  });
}
