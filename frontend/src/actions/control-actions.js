export const ADD_SEARCH_TERM = 'search';
export const SET_SEARCH_RESULTS = 'setSearchResults';
export const ADD_TRACK = 'addTrack';
export const SET_TRACKLIST = 'setTracklist';
export const VOTE_TRACK_DOWN = 'downvoteTrack';
export const VOTE_TRACK_UP = 'upvoteTrack';
export const SET_PLAYSTATE = 'setPlaystate';
export const GET_PLAYSTATE = 'getPlaystate';
export const CTRL_PLAYPAUSE = 'playpause';
export const CTRL_VOLUME = 'setVolume';

export function addSearchTerm(query) {
  return { type: ADD_SEARCH_TERM, query };
}

export function setSearchResults(data) {
  return { type: SET_SEARCH_RESULTS, data };
}

export function addTrack(track) {
  return { type: ADD_TRACK, track};
}

export function setTracklist(tracklist) {
  return { type: SET_TRACKLIST, tracklist};
}

export function upvoteTrack(track) {
  return {type: VOTE_TRACK_UP, track};
}

export function downvoteTrack(track) {
  return {type: VOTE_TRACK_DOWN, track};
}

export function playpause() {
  return {type: CTRL_PLAYPAUSE, true };
}

export function setPlaystate(playstate) {
  return {type: SET_PLAYSTATE, playstate};
}

export function getPlaystate() {
  return {type: GET_PLAYSTATE, true};
}

export function setVolume(value) {
  return {type: CTRL_VOLUME, value};
}
