import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as messageActionCreators from '../../actions/control-actions';
import Search from '../search/';
import Searchresults from '../searchresults/';
import Tracklist from '../tracklist/';
import Player from '../player/';


class App extends Component {
  render() {
    return (
      <div className="appWrapper">
        <div className="search">
          <div className="header">
            <h2>Search</h2>
          </div>
          <div className="searchWrapper">
            <Search
              onSearch={this.props.addSearchTerm}
              />
            <Searchresults
              results={this.props.searchresults}
              onTrackAdded={this.props.addTrack}
            />
          </div>
        </div>
        <Tracklist
          tracklistdata={this.props.tracklist}
          onTrackVotedUp={this.props.upvoteTrack}
          onTrackVotedDown={this.props.downvoteTrack}
        />
        <Player
          state={this.props.playstate}
          updatePlaystate={this.props.getPlaystate}
          onPlayPause={this.props.playpause}
          onVolumeChange={this.props.setVolume}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchresults: state.searchresults,
    tracklist: state.tracklist,
    playstate: state.playstate,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(messageActionCreators, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
