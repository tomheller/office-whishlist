import {combineReducers} from 'redux';
import * as actions from '../actions/control-actions'

export default function (initialState) {
  function searchresults(currentSearchresults = initialState.searchresults, action) {
    if(action.type === actions.SET_SEARCH_RESULTS) {
      return action.data;
    }
    return currentSearchresults;
  }

  function tracklist(currentTracklist = initialState.tracklist, action) {
    if(action.type === actions.SET_TRACKLIST) {
      return action.tracklist;
    }
    return currentTracklist;
  }

  function playstate(currentPlaystate = initialState.playstate, action) {
    if(action.type === actions.SET_PLAYSTATE) {
      return action.playstate;
    }
    return currentPlaystate;
  }
  return combineReducers({searchresults, tracklist, playstate});
}
