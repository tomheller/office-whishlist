import React, {Component} from 'react';
import Track from '../track';

class Tracklist extends Component {

  render() {
    return (
      <div className="tracklist">
        <div className="header">
          <h2>Tracklist</h2>
        </div>
        <div className="tracklist__tracks">
      {this.props.tracklistdata.map((track, index) => {
        return(
          <Track key={track.uri}
            addable={false}
            trackdata={track}
            onTrackVotedUp={this.props.onTrackVotedUp}
            onTrackVotedDown={this.props.onTrackVotedDown} />
          );
      })}
      </div>
      </div>
    )
  }
}

Tracklist.propTypes = {
  onTrackAdded: React.PropTypes.func,
  onTrackVotedUp: React.PropTypes.func,
  onTrackVotedDown: React.PropTypes.func,
};

export default Tracklist;
